const assignmentCollection = require('../db/assignment')
const assignOrderCollection = require('../db/assignOrder')
const componentCollection = require('../db/component')
const componentTypeCollection = require('../db/componentType')
const lodash = require('lodash')
const quarterMap = {
    '第1季度': 'First-Ldar-Quarter',
    '第2季度': 'Second-Ldar-Quarter',
    '第3季度': 'Third-Ldar-Quarter',
    '第4季度': 'Fourth-Ldar-Quarter',
}
const dateMap = {
    'First-Ldar-Quarter': { start: '01-01', end: '04-01'},
    'Second-Ldar-Quarter': { start: '04-01', end:'07-01'},
    'Third-Ldar-Quarter': { start: '07-01', end:'10-01'},
    'Fourth-Ldar-Quarter': { start: '10-01', end:'01-01'},
}

async function queryAssignment (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { year = '', quarter = '' } = ctx.request.query
        const query = { companyNum }
        if (year) query.year = year
        if (quarter && quarter !== 'all') query.quarter = quarter

        const data = await assignmentCollection.find(query).toArray()

        ctx.body = { code: 0 , message: '查询任务成功', data }
    } catch (err) {
        logger.log('queryAssignment异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询任务失败' }
    }
}

async function addAssignment (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { year = '', quarter = '', detectType } = ctx.request.body

        const quarterCode = year + '-' + quarterMap[quarter]
        const quarterStr = quarterCode.split('-')[1] + '-' + quarterCode.split('-')[2] + '-' + quarterCode.split('-')[3]

        const data = {
            companyNum,
            quarterCode,
            quarter, 
            year, 
            detectType,
            assigned: 0,
            noAssigned: 0,
            detected: 0,
            noDetected: 0,
            leakFix: 0,
            totalPoint: 0,
            startDate: year + '-' + dateMap[quarterStr].start,
            endDate: year + '-' + dateMap[quarterStr].end,
            createDate: new Date(),
            createUser: username,
        }

        if (detectType === '周期检') { // 周期检只检测动密封
            let componentTypes = await componentTypeCollection.find({ sealPointType: '动密封' }).toArray()
            componentTypeArr = lodash.map(componentTypes, 'componentType')

            let componentData = await componentCollection.find({ companyNum }).toArray()
            componentData = lodash.filter(componentData, c => { return componentTypeArr.includes(c.componentType) })

            // 动密封个数
            data.totalPoint = componentData.length
        } else {
            data.totalPoint = await componentCollection.count()
        }

        await assignmentCollection.insertOne(data)

        ctx.body = { code: 0 , message: '添加任务成功' }
    } catch (err) {
        logger.log('addAssignment异常:' + err, "error")
        ctx.body = { code: -1 , message: '添加任务失败' }
    }
}

async function deleteAssignment (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const quarterCodeArr = lodash.map(deleteData, 'quarterCode')

        await assignmentCollection.deleteMany({ companyNum, quarterCode: { $in: quarterCodeArr } })
        await assignOrderCollection.deleteMany({ companyNum, quarterCode: { $in: quarterCodeArr } })

        ctx.body = { code: 0 , message: '删除检测任务成功' }
    } catch (err) {
        logger.log('deleteAssignment异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除检测任务失败' }
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

        // 已分配的数量
        const assignment = await assignmentCollection.findOne({ companyNum, quarterCode })
        const { assigned: assignedCount, detectType = '' } = assignment

        // 筛选
        const query = {}
        if (detectType === '周期检') query.sealPointType = '动密封'

        // 未分配的数据
        let componentData = await componentCollection.find(query).skip(+assignedCount).toArray()

        // 多次筛选
        if(device) componentData = lodash.filter(componentData, c => { return c.device === device })
        if(area) componentData = lodash.filter(componentData, c => { return c.area === area })
        if(equipment) componentData = lodash.filter(componentData, c => { return c.equipment === equipment })
        if(unreachable) componentData = lodash.filter(componentData, c => { return c.unreachable === unreachable })
        if(sealPointType) componentData = lodash.filter(componentData, c => { return c.sealPointType === sealPointType })

        // 位置描述拼接
        componentData = componentData.map(item => { 
            item.location = `${item.equipment} ${item.location} ${item.distance}米 ${item.floor}楼 ${item.high}米`
            item.assignStatus = '未分配'
            return item
        })

        const total = componentData.length
        componentData = componentData.slice((currentPage-1) * pageSize, currentPage * pageSize)

        ctx.body = { code: 0 , message: '未分配查询成功', data: { componentData, total } }
    } catch (err) {
        logger.log('queryNoAssign异常:' + err, "error")
        ctx.body = { code: -1 , message: '未分配查询失败' }
    }
}

async function assign (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { quarterCode = '', assignNum = '', employee = '', assignPoint = '' } = ctx.request.body

        // 已分配的数量
        const assignedCount = (await assignmentCollection.findOne({ companyNum, quarterCode })).assigned
        // console.log("assign assignedCount", assignedCount)

        // 要分配的数据
        let componentData = await componentCollection.find().skip(+assignedCount).toArray()
        componentData = componentData.slice(0, assignPoint)

        // 记录 标签号 + 扩展号
        const labelExpandArr = []
        for (const c of componentData) {
            labelExpandArr.push(c.labelExpand)
        }

        const year = quarterCode.split('-')[0]
        const quarterStr = quarterCode.split('-')[1] + '-' + quarterCode.split('-')[2] + '-' + quarterCode.split('-')[3]

        // 新增任务
        const data = {
            companyNum,
            quarterCode, 
            assignNum, 
            employee, 
            assignPoint: +assignPoint, 
            labelExpandArr, 
            detected: 0, 
            noDetected: 0, 
            leakFix: 0, 
            isFinished: '否',
            startDate: year + '-' + dateMap[quarterStr].start,
            endDate: year + '-' + dateMap[quarterStr].end,
            createDate: new Date(),
            createUser: username
        }

        await assignOrderCollection.insertOne(data)

        // 更新
        await assignmentCollection.updateOne({ quarterCode }, { $inc: { assigned: +assignPoint }})

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
        const quarterCodeArr = lodash.map(deleteData, 'quarterCode')

        await assignOrderCollection.deleteMany({ companyNum, quarterCode: { $in: quarterCodeArr } })

        ctx.body = { code: 0 , message: '删除任务成功' }
    } catch (err) {
        logger.log('deleteAssignment异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除任务失败' }
    }
}

async function queryAssignDetail (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '', currentPage = 1, pageSize = 10 } = ctx.request.body

        const query = { companyNum, quarterCode }
        const assignOrderData = await assignOrderCollection.find(query).limit(+pageSize).skip((+currentPage - 1) * pageSize).toArray()
        const total = await assignOrderCollection.count(query)

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
    deleteAssign,
    queryAssignDetail,
}
