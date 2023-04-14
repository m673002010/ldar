const assignmentCollection = require('../db/assignment')
const assignOrderCollection = require('../db/assignOrder')
const componentCollection = require('../db/component')
const lodash = require('lodash')

async function queryTask (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '', assignNum = '', employee = '', currentPage = 1, pageSize = 10 } = ctx.request.query

        const query = { companyNum }
        if (quarterCode) query.quarterCode = quarterCode
        if (assignNum) query.assignNum = assignNum
        if (employee) query.employee = employee

        let assignOrderData = await assignOrderCollection.find(query).limit(+pageSize).skip((+currentPage - 1) * pageSize).toArray()
        const total = await assignOrderCollection.count(query)

        assignOrderData = assignOrderData.map(item => {
            item.assigned = item.assignedArr.length
            item.detected = item.detectedArr.length
            item.leakFix = item.leakFixArr.length

            return item
        })

        ctx.body = { code: 0 , message: '查询任务详情成功', data: { assignOrderData, total } }
    } catch (err) {
        logger.log('queryTask异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询任务详情成功失败' }
    }
}

async function downloadTask (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode, assignNum } = ctx.request.query
        const query = { companyNum, quarterCode, assignNum }

        const { assignedArr } = await assignOrderCollection.findOne(query)

        const componentData = await componentCollection.find({ labelExpand: { $in: assignedArr } }).toArray()

        ctx.body = { code: 0 , message: '下载任务成功', data: componentData }
    } catch (err) {
        logger.log('downloadTask异常:' + err, "error")
        ctx.body = { code: -1 , message: '下载任务失败' }
    }
}

async function queryQuarterCode (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        let quarterCodeArr = await assignmentCollection.find({ companyNum }).toArray()
        quarterCodeArr = lodash.map(quarterCodeArr, 'quarterCode') 

        ctx.body = { code: 0 , message: '查询检测周期编号成功', data: quarterCodeArr }
    } catch (err) {
        logger.log('queryQuarterCode异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询检测周期编号失败' }
    }
}

async function queryAssignNum (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        let assignNumArr = await assignOrderCollection.find({ companyNum }).toArray()
        assignNumArr = lodash.map(assignNumArr, 'assignNum') 

        ctx.body = { code: 0 , message: '查询任务编号成功', data: assignNumArr }
    } catch (err) {
        logger.log('queryAssignNum异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询任务编号失败' }
    }
}

module.exports = {
    queryTask,
    downloadTask,
    queryQuarterCode,
    queryAssignNum
}
