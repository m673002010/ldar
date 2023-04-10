const assignmentCollection = require('../db/assignment')
const componentCollection = require('../db/component')
const componentTypeCollection = require('../db/componentType')
const { ObjectId } = require('mongodb')
const lodash = require('lodash')
const quarterMap = {
    '第1季度': 'First-Ldar-Quarter',
    '第2季度': 'Second-Ldar-Quarter',
    '第3季度': 'Third-Ldar-Quarter',
    '第4季度': 'Fourth-Ldar-Quarter',
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

module.exports = {
    queryAssignment,
    addAssignment,
    deleteAssignment
}
