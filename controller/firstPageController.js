const assignmentCollection = require('../db/assignment')
const componentCollection = require('../db/component')
const lodash = require('lodash')
const dateMap = {
    'First-Ldar-Quarter': { start: '0101', end: '0331'},
    'Second-Ldar-Quarter': { start: '0401', end:'0631'},
    'Third-Ldar-Quarter': { start: '0701', end:'0931'},
    'Fourth-Ldar-Quarter': { start: '1001', end:'1231'},
}

async function currentCycle (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        let quarterCode
        const date = new Date()
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const monthDay = month + '' + day

        for (let key in dateMap) {
            if (+monthDay >= +dateMap[key].start && +monthDay <= +dateMap[key].end){
                quarterCode = year + '-' + key
            }
        }

        // 查询当前周期
        const assignmentData = await assignmentCollection.findOne({ companyNum, quarterCode })
        const labelExpandArr = assignmentData.labelExpandArr
        const detectedArr = assignmentData.detectedArr
        const leakFixArr = assignmentData.leakFixArr

        // 是否可达的数量
        const unreachableCount = await componentCollection.count({ companyNum, labelExpand: { $in: labelExpandArr }, unreachable: '是' })
        const reachableCount = await componentCollection.count({ companyNum, labelExpand: { $in: labelExpandArr }, unreachable: '否' })

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

        const tableData = deviceAllArr.map(item => {
            const obj = { device: item.name }
            const d = lodash.find(deviceDetectedArr, { 'name': item.name })
            const l = lodash.find(deviceLeakArr, { 'name': item.name })

            obj.totalPoint = item.value
            obj.detectedPoint = d ? d.value : 0 
            obj.leakPoint = l ? l.value : 0
            obj.finishRatio = obj.totalPoint ? (obj.detectedPoint / obj.totalPoint) * 100 + '%' : '0%'
            obj.leakRatio = obj.detectedPoint ? (obj.leakPoint / obj.detectedPoint) * 100 + '%' : '0%'
            obj.delayFix = 0

            return obj
        })
        
        const data = {
            detected: assignmentData.detectedArr.length,
            leakFix: assignmentData.leakFixArr.length,
            delayFix: 0,
            unreachableCount,
            reachableCount,
            // deviceAllArr,
            // deviceDetectedArr,
            tableData,
            deviceLeakArr,
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

        let detectedArr = []
        const assignmentData = await assignmentCollection.find({ companyNum }).toArray()
        assignmentData.map(item => detectedArr = detectedArr.concat(item.detectedArr))
        const componentDetectedData = await componentCollection.find({ companyNum, labelExpand: { $in: detectedArr } }).toArray()

        // 计算可达不可达点数
        let unreachableCount = 0
        let reachableCount = 0
        detectedArr.map(labelExpand => {
            const c = lodash.find(componentDetectedData, { 'labelExpand': labelExpand })
            c.unreachable === '是' ? unreachableCount++ : reachableCount++
        })

        // 泄漏点的装置信息
        let leakFixArr = []
        assignmentData.map(item => leakFixArr = leakFixArr.concat(item.leakFixArr))
        const componentLeakData = await componentCollection.find({ companyNum, labelExpand: { $in: leakFixArr } }).toArray()
        const deviceLeakData = leakFixArr.map(labelExpand => {
            const c = lodash.find(componentLeakData, { 'labelExpand': labelExpand })
            return { device: c.device }
        })
        const deviceData = lodash.groupBy(deviceLeakData, 'device')
        const deviceArr = []
        for (const key in deviceData) {
            deviceArr.push({ name: key, value: deviceData[key].length })
        }
        
        const data = {
            detected: detectedArr.length,
            leakFix: leakFixArr.length,
            delayFix: 0,
            unreachableCount,
            reachableCount,
            deviceArr
        }

        ctx.body = { code: 0 , message: '获取所有周期信息成功', data }
    } catch (err) {
        logger.log('allCycle异常:' + err, "error")
        ctx.body = { code: -1 , message: '获取所有周期信息失败' }
    }
}

async function deviceStatistic (ctx, next) {
    try {

    } catch (err) {
        logger.log('deviceStatistic异常:' + err, "error")
        ctx.body = { code: -1 , message: '获取装置统计失败' }
    }
}

module.exports = {
    currentCycle,
    allCycle,
    deviceStatistic
}
