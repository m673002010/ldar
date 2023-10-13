const assignmentCollection = require('../db/assignment')
const assignOrderCollection = require('../db/assignOrder')
const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const lodash = require('lodash')

const dateMap = {
    '第1季度': { start: '01-01', end: '04-01'},
    '第2季度': { start: '04-01', end:'07-01'},
    '第3季度': { start: '07-01', end:'10-01'},
    '第4季度': { start: '10-01', end:'01-01'},
}

async function queryAssignment (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { year = '', quarter = '' } = ctx.request.query
        const query = { companyNum }
        if (year) query.year = year
        if (quarter) query.quarter = quarter

        let assignmentData = await assignmentCollection.find(query).toArray()
        assignmentData = assignmentData.map(item => {
            item.totalPoint = item.labelExpandArr.length
            item.assigned = item.assignedArr.length
            item.detected = item.detectedArr.length
            item.unDetected = item.assignedArr.length - item.detectedArr.length
            item.leakFix = item.leakFixArr.length

            return item
        })

        ctx.body = { code: 0 , message: '查询检测周期成功', data: assignmentData }
    } catch (err) {
        logger.log('queryAssignment异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询检测周期失败' }
    }
}

async function addAssignment (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { year = '', quarter = '', detectType } = ctx.request.body

        // 拼接检测周期编号
        const quarterCode = year + '-' + quarter

        const data = {
            companyNum,
            quarterCode,
            quarter, 
            year, 
            detectType,
            labelExpandArr: [],
            assignedArr: [],
            detectedArr: [],
            leakFixArr: [],
            startDate: year + '-' + dateMap[quarter].start,
            endDate: year + '-' + dateMap[quarter].end,
            createDate: new Date(),
            createUser: username,
        }

        // 周期检只检测动密封，全检测检查动静密封
        let componentData = []
        if (detectType === '周期检') componentData = await componentCollection.find({ companyNum, sealPointType: '动密封' }).toArray()
        else componentData = await componentCollection.find({ companyNum }).toArray()

        data.labelExpandArr = lodash.map(componentData, 'labelExpand')

        await assignmentCollection.insertOne(data)

        ctx.body = { code: 0 , message: '添加检测周期成功' }
    } catch (err) {
        logger.log('addAssignment异常:' + err, "error")
        ctx.body = { code: -1 , message: '添加检测周期失败' }
    }
}

async function deleteAssignment (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const quarterCodeArr = lodash.map(deleteData, 'quarterCode')

        await assignmentCollection.deleteMany({ companyNum, quarterCode: { $in: quarterCodeArr } })
        await assignOrderCollection.deleteMany({ companyNum, quarterCode: { $in: quarterCodeArr } })
        await detectLedgerCollection.deleteMany({ companyNum, quarterCode: { $in: quarterCodeArr } })

        ctx.body = { code: 0 , message: '删除检测周期成功' }
    } catch (err) {
        logger.log('deleteAssignment异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除检测周期失败' }
    }
}

async function queryNoAssign (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { 
            quarterCode = '', 
            device = '', 
            area = '', 
            equipment = '',
            unreachable = '',
            sealPointType = '',
            currentPage = 1,
            pageSize = 10
        } = ctx.request.query

        // 总数量 已分配的数量
        const { labelExpandArr, assignedArr } = await assignmentCollection.findOne({ companyNum, quarterCode })

        // 未分配的数据
        const noAssignedArr = lodash.difference(labelExpandArr, assignedArr)
        let componentData = await componentCollection.find({ companyNum, labelExpand: { $in: noAssignedArr } }).toArray()

        // 根据条件筛选
        if(device) componentData = lodash.filter(componentData, c => { return c.device === device })
        if(area) componentData = lodash.filter(componentData, c => { return c.area === area })
        if(equipment) componentData = lodash.filter(componentData, c => { return c.equipment === equipment })
        if(unreachable) componentData = lodash.filter(componentData, c => { return c.unreachable === unreachable })
        if(sealPointType) componentData = lodash.filter(componentData, c => { return c.sealPointType === sealPointType })

        const total = componentData.length
        componentData = componentData.slice((currentPage-1) * pageSize, currentPage * pageSize)

        // 位置描述拼接
        componentData = componentData.map(item => { 
            item.location = `${item.equipment} ${item.location} ${item.distance}米 ${item.floor}楼 ${item.high}米`
            item.assignStatus = '未分配'
            return item
        })

        ctx.body = { code: 0 , message: '未分配任务查询成功', data: { componentData, total } }
    } catch (err) {
        logger.log('queryNoAssign异常:' + err, "error")
        ctx.body = { code: -1 , message: '未分配任务查询失败' }
    }
}

async function assign (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { quarterCode = '', assignNum = '', detectPeople = '', assignPoint = 0 } = ctx.request.body

        // 获取未分配
        let { assignedArr, labelExpandArr } = await assignmentCollection.findOne({ companyNum, quarterCode })
        let noAssignedArr = lodash.difference(labelExpandArr, assignedArr)

        // 分配
        let assignArr = []
        if (noAssignedArr.length >= assignPoint) {
            assignArr = noAssignedArr.slice(0, assignPoint)
            assignedArr = assignedArr.concat(assignArr)
        } else {
            assignArr = noAssignedArr
            assignedArr = assignedArr.concat(assignArr)
        }

        const year = quarterCode.split('-')[0]
        const quarter = quarterCode.split('-')[1]

        // 新增任务单
        const data = {
            companyNum,
            quarterCode, 
            assignNum, 
            detectPeople,
            assignedArr: assignArr, 
            detectedArr: [],
            leakFixArr: [], 
            isFinished: '否',
            startDate: year + '-' + dateMap[quarter].start,
            endDate: year + '-' + dateMap[quarter].end,
            createDate: new Date(),
            createUser: username
        }

        await assignOrderCollection.insertOne(data)

        // 更新检测周期
        await assignmentCollection.updateOne({ companyNum, quarterCode }, { $set: { assignedArr } })

        ctx.body = { code: 0 , message: '分配任务成功' }
    } catch (err) {
        logger.log('assign异常:' + err, "error")
        ctx.body = { code: -1 , message: '分配任务失败' }
    }
}

async function pick (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { pickData = [], quarterCode = '', assignNum = '', detectPeople = '' } = ctx.request.body

        // 挑选分配的点
        const assignArr = lodash.map(pickData, item => { return item.label + '-' + item.expand })

        // 未分配的点
        let { assignedArr } = await assignmentCollection.findOne({ companyNum, quarterCode })

        // 分配
        assignedArr = assignedArr.concat(assignArr)

        const year = quarterCode.split('-')[0]
        const quarter = quarterCode.split('-')[1]

        // 新增任务单
        const data = {
            companyNum,
            quarterCode, 
            assignNum, 
            detectPeople,
            assignedArr: assignArr, 
            detectedArr: [],
            leakFixArr: [], 
            isFinished: '否',
            startDate: year + '-' + dateMap[quarter].start,
            endDate: year + '-' + dateMap[quarter].end,
            createDate: new Date(),
            createUser: username
        }

        await assignOrderCollection.insertOne(data)

        // 更新检测周期
        await assignmentCollection.updateOne({ companyNum, quarterCode }, { $set: { assignedArr } })

        ctx.body = { code: 0 , message: '分配任务成功' }
    } catch (err) {
        logger.log('assign异常:' + err, "error")
        ctx.body = { code: -1 , message: '分配任务失败' }
    }
}

async function deleteAssign (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body

        // 获得删除的任务单号
        const quarterCode = lodash.map(deleteData, 'quarterCode')[0]
        const assignNumArr = lodash.map(deleteData, 'assignNum')

        let { assignedArr, detectedArr, leakFixArr } = await assignmentCollection.findOne({ companyNum, quarterCode })

        const assignOrderData = await assignOrderCollection.find({ 
            companyNum, 
            quarterCode,
            assignNum: { $in: assignNumArr },
        }).toArray()

        // 删除任务单时，检测周期对应的数据也减除
        for (const a of assignOrderData) {
            assignedArr = lodash.difference(assignedArr, a.assignedArr)
            detectedArr = lodash.difference(detectedArr, a.detectedArr)
            leakFixArr = lodash.difference(leakFixArr, a.leakFixArr)
        }

        await assignmentCollection.updateOne({ companyNum, quarterCode }, { $set: { assignedArr, detectedArr, leakFixArr } })
        await assignOrderCollection.deleteMany({ companyNum, quarterCode, assignNum: { $in: assignNumArr } })
        await detectLedgerCollection.deleteMany({ companyNum, quarterCode, assignNum: { $in: assignNumArr } })

        ctx.body = { code: 0 , message: '删除任务成功' }
    } catch (err) {
        logger.log('deleteAssign异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除任务失败' }
    }
}

async function queryAssignDetail (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '', currentPage = 1, pageSize = 10 } = ctx.request.query

        const query = { companyNum, quarterCode }
        let assignOrderData = await assignOrderCollection.find(query).limit(+pageSize).skip((+currentPage - 1) * pageSize).toArray()
        const total = await assignOrderCollection.count(query)

        assignOrderData = assignOrderData.map(item => {
            item.detected = item.detectedArr.length
            item.unDetected = item.assignedArr.length - item.detectedArr.length
            item.leakFix = item.leakFixArr.length

            return item
        })

        ctx.body = { code: 0 , message: '查询任务详情成功', data: { assignOrderData, total } }
    } catch (err) {
        logger.log('queryAssignDetail异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询任务详情成功失败' }
    }
}

module.exports = {
    queryAssignment,
    addAssignment,
    deleteAssignment,
    queryNoAssign,
    assign,
    pick,
    deleteAssign,
    queryAssignDetail,
}
