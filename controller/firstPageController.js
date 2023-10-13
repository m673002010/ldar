const assignmentCollection = require('../db/assignment')
const componentCollection = require('../db/component')
const lodash = require('lodash')
const dateMap = {
    '第1季度': { start: 1, end: 3},
    '第2季度': { start: 4, end: 6},
    '第3季度': { start: 7, end: 9},
    '第4季度': { start: 10, end:12 },
}

async function currentCycle (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        let quarterCode
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth() + 1

        for (let key in dateMap) {
            if (month >= +dateMap[key].start && +month <= +dateMap[key].end){
                quarterCode = year + '-' + key
            }
        }

        // 查询当前周期
        const assignmentData = await assignmentCollection.findOne({ companyNum, quarterCode })
        const labelExpandArr = assignmentData.labelExpandArr
        const detectedArr = assignmentData.detectedArr
        const leakFixArr = assignmentData.leakFixArr

        // 可达不可达点数
        const unreachableCount = await componentCollection.count({ companyNum, labelExpand: { $in: detectedArr }, unreachable: '是' })
        const reachableCount = await componentCollection.count({ companyNum, labelExpand: { $in: detectedArr }, unreachable: '否' })

        // 装置总数量
        const componentAllData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        const deviceAllData = lodash.groupBy(componentAllData, 'device')
        const deviceAllArr = []
        for (const key in deviceAllData) {
            deviceAllArr.push({ name: key, value: deviceAllData[key].length })
        }
        
        // 装置检测数量
        const componentDetectedData = await componentCollection.find({ companyNum, labelExpand: { $in: detectedArr } }).toArray()
        const deviceDetectedData = lodash.groupBy(componentDetectedData, 'device')
        const deviceDetectedArr = []
        for (const key in deviceDetectedData) {
            deviceDetectedArr.push({ name: key, value: deviceDetectedData[key].length })
        }

        // 装置泄漏数量
        const componentLeakData = await componentCollection.find({ companyNum, labelExpand: { $in: leakFixArr } }).toArray()
        const deviceLeakData = lodash.groupBy(componentLeakData, 'device')
        const deviceLeakArr = []
        for (const key in deviceLeakData) {
            deviceLeakArr.push({ name: key, value: deviceLeakData[key].length })
        }

        // 表格
        const tableData = deviceAllArr.map(item => {
            const obj = { device: item.name }
            const d = lodash.find(deviceDetectedArr, { 'name': item.name })
            const l = lodash.find(deviceLeakArr, { 'name': item.name })

            obj.totalPoint = item.value
            obj.detectedPoint = d ? d.value : 0 
            obj.leakPoint = l ? l.value : 0
            obj.delayFix = 0

            return obj
        })
        
        const data = {
            detected: assignmentData.detectedArr.length,
            leakFix: assignmentData.leakFixArr.length,
            delayFix: 0,
            unreachableCount,
            reachableCount,
            deviceLeakArr,
            tableData,
        }

        ctx.body = { code: 0 , message: '获取当前周期信息成功', data }
    } catch (err) {
        logger.log('currentCycle异常:' + err, "error")
        ctx.body = { code: -1 , message: '获取当前周期信息失败' }
    }
}

async function allCycle (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo

        const assignmentData = await assignmentCollection.find({ companyNum }).toArray()

        // 装置总数量
        let labelExpandArr = []
        assignmentData.map(item => labelExpandArr = labelExpandArr.concat(item.labelExpandArr))
        const componentAllData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        let deviceALLData = labelExpandArr.map(labelExpand => {
            const c = lodash.find(componentAllData, { 'labelExpand': labelExpand })
            return { device: c.device }
        })
        deviceALLData = lodash.groupBy(deviceALLData, 'device')
        const deviceAllArr = []
        for (const key in deviceALLData) {
            deviceAllArr.push({ name: key, value: deviceALLData[key].length })
        }

        // 装置检测数量
        let detectedArr = []
        assignmentData.map(item => detectedArr = detectedArr.concat(item.detectedArr))
        const componentDetectedData = await componentCollection.find({ companyNum, labelExpand: { $in: detectedArr } }).toArray()
        let deviceDetectedData = detectedArr.map(labelExpand => {
            const c = lodash.find(componentDetectedData, { 'labelExpand': labelExpand })
            return { device: c.device }
        })
        deviceDetectedData = lodash.groupBy(deviceDetectedData, 'device')
        const deviceDetectedArr = []
        for (const key in deviceDetectedData) {
            deviceDetectedArr.push({ name: key, value: deviceDetectedData[key].length })
        }

        // 可达不可达点数
        let unreachableCount = 0
        let reachableCount = 0
        detectedArr.map(labelExpand => {
            const c = lodash.find(componentDetectedData, { 'labelExpand': labelExpand })
            c.unreachable === '是' ? unreachableCount++ : reachableCount++
        })

        // 装置泄漏数量
        let leakFixArr = []
        assignmentData.map(item => leakFixArr = leakFixArr.concat(item.leakFixArr))
        const componentLeakData = await componentCollection.find({ companyNum, labelExpand: { $in: leakFixArr } }).toArray()
        let deviceLeakData = leakFixArr.map(labelExpand => {
            const c = lodash.find(componentLeakData, { 'labelExpand': labelExpand })
            return { device: c.device }
        })
        deviceLeakData = lodash.groupBy(deviceLeakData, 'device')
        const deviceLeakArr = []
        for (const key in deviceLeakData) {
            deviceLeakArr.push({ name: key, value: deviceLeakData[key].length })
        }

        // 表格
        const tableData = deviceAllArr.map(item => {
            const obj = { device: item.name }
            const d = lodash.find(deviceDetectedArr, { 'name': item.name })
            const l = lodash.find(deviceLeakArr, { 'name': item.name })

            obj.totalPoint = item.value
            obj.detectedPoint = d ? d.value : 0 
            obj.leakPoint = l ? l.value : 0
            obj.delayFix = 0

            return obj
        })
        
        const data = {
            detected: detectedArr.length,
            leakFix: leakFixArr.length,
            delayFix: 0,
            unreachableCount,
            reachableCount,
            deviceLeakArr,
            tableData
        }

        ctx.body = { code: 0 , message: '获取所有周期信息成功', data }
    } catch (err) {
        logger.log('allCycle异常:' + err, "error")
        ctx.body = { code: -1 , message: '获取所有周期信息失败' }
    }
}

module.exports = {
    currentCycle,
    allCycle,
}
