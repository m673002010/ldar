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

        const data = {
            companyNum,
            quarterCode: year + '-' + quarterMap[quarter],
            quarter, 
            year, 
            detectType,
            assigned: 0,
            noAssigned: 0,
            detected: 0,
            noDetected: 0,
            leakFix: 0,
            totalPoint: 0,
            startDate: '2023-01-01',
            endDate: '2023-04-01',
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

        ctx.body = { code: 0 , message: '删除任务成功' }
    } catch (err) {
        logger.log('deleteAssignment异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除任务失败' }
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
            sealPointType = '',
            unreachable = '',
            currentPage = 1,
            pageSize = 10
        } = ctx.request.query

        // 已分配的数量
        const assignedCount = (await assignmentCollection.findOne({ companyNum, quarterCode })).assigned
        // 根据动静密封筛选
        const q = {}
        if (sealPointType) q.sealPointType = sealPointType
        let componentTypes = await componentTypeCollection.find(q).toArray()
        componentTypeArr = lodash.map(componentTypes, 'componentType')

        // 未分配的数据
        let componentData = await componentCollection.find().skip(+assignedCount).toArray()

        // 多次筛选
        componentData = lodash.filter(componentData, c => { return componentTypeArr.includes(c.componentType) })
        if(device) componentData = lodash.filter(componentData, c => { return c.device === device })
        if(area) componentData = lodash.filter(componentData, c => { return c.area === area })
        if(equipment) componentData = lodash.filter(componentData, c => { return c.equipment === equipment })
        if(unreachable) componentData = lodash.filter(componentData, c => { return c.unreachable === unreachable })

        // 位置描述拼接
        componentData = componentData.map(item => { 
            item.location = `${item.equipment} ${item.location} ${item.distance}米 ${item.floor}楼 ${item.high}米`
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
            startDate: dateMap[quarterStr].start,
            endDate: dateMap[quarterStr].end,
            createDate: new Date(),
            createUser: username
        }

        await assignOrderCollection.insertOne(data)

        // 更新
        await assignmentCollection.updateOne({ quarterCode }, { $inc: { assigned: +assignPoint })

        ctx.body = { code: 0 , message: '分配任务成功' }
    } catch (err) {
        logger.log('assign异常:' + err, "error")
        ctx.body = { code: -1 , message: '分配任务失败' }
    }
}

module.exports = {
    queryAssignment,
    addAssignment,
    deleteAssignment,
    queryNoAssign,
    assign,
}
