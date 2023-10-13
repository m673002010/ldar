const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const pictureLedgerCollection = require('../db/pictureLedger.js')
const lodash = require('lodash')

async function detectionDataLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { 
            year = '',
            quarter = '', 
            label = '', 
            unreachable = '', 
            isLeak = '', 
            medium = '',
            mediumStatus = '', 
            date = null, 
            device = '',
            area = '',
            equipment = '',
            componentType = '',
            sealPointType = '',
            detectPeople = '',
            currentPage = 1,
            pageSize = 10
        } = ctx.request.body

        const query = { companyNum }
        if (label) query.label = label
        if (device) query.device = device
        if (area) query.area = area
        if (isLeak) query.area = isLeak
        if (equipment) query.equipment = equipment
        if (date && date.length) {
            query.detectStartDate = { $gte: new Date(date[0]) }
            query.detectEndDate = { $lte: new Date(date[1]) }
        }
        if (detectPeople) query.detectPeople = detectPeople

        // 检测数据
        let detectData = await detectLedgerCollection.find(query).toArray()

        // 补充图片信息
        const pictures = await pictureLedgerCollection.find({ companyNum }).toArray()

        // 补充组件信息
        const labelExpandArr = lodash.map(detectData, 'labelExpand')
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        detectData = detectData.map(item => {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            if (component) delete component._id
            Object.assign(item, component)

            const pic = lodash.find(pictures, { 'label': item.label })
            if (pic) Object.assign(item, { picturePath: pic.picturePath})

            item.detectNetWorth = item.detectValue - item.detectBackgroundValue
            item.picture = item.label
            item.rateBeforeRepair = item.leakRate
            item.valueBeforeRepair = item.detectNetWorth
            item.backgroundValueBeforeRepair = item.detectBackgroundValue
            item.leakLevel = '安全'
            item.limitTime = item.detectEndDate - item.detectStartDate

            return item
        })

        if (year) detectData = lodash.filter(detectData, item => { return item.quarterCode.indexOf(year) !== -1 })
        if (quarter) detectData = lodash.filter(detectData, item => { return item.quarterCode.indexOf(quarter) !== -1 })
        if (componentType) detectData = lodash.filter(detectData, item => { return item.componentType === componentType })
        if (medium) detectData = lodash.filter(detectData, item => { return item.medium === medium })
        if (mediumStatus) detectData = lodash.filter(detectData, item => { return item.mediumStatus === mediumStatus })
        if (unreachable) detectData = lodash.filter(detectData, item => { return item.unreachable === unreachable })
        if (sealPointType) detectData = lodash.filter(detectData, item => { return item.sealPointType === sealPointType })

        const total = detectData.length
        detectData = detectData.slice((currentPage-1) * pageSize, currentPage * pageSize)

        ctx.body = { code: 0 , message: '查询检测数据台账成功', data: { detectData, total } }
    } catch (err) {
        logger.log('detectionDataLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询检测数据台账失败' }
    }
}

async function exportDetectionDataLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { 
            year = '',
            quarter = '', 
            label = '', 
            unreachable = '', 
            isLeak = '', 
            medium = '',
            mediumStatus = '', 
            date = null, 
            device = '',
            area = '',
            equipment = '',
            componentType = '',
            sealPointType = '',
            detectPeople = '',
        } = ctx.request.body

        const query = { companyNum }
        if (label) query.label = label
        if (device) query.device = device
        if (area) query.area = area
        if (isLeak) query.area = isLeak
        if (equipment) query.equipment = equipment
        if (date && date.length) {
            query.detectStartDate = { $gte: new Date(date[0]) }
            query.detectEndDate = { $lte: new Date(date[1]) }
        }
        if (detectPeople) query.detectPeople = detectPeople


        // 检测数据
        let detectData = await detectLedgerCollection.find(query).toArray()

        // 补充组件信息
        const labelExpandArr = lodash.map(detectData, 'labelExpand')
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        detectData = detectData.map(item => {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            if (component) delete component._id
            Object.assign(item, component)

            // 导出表格字段调整
            item.detectNetWorth = item.detectValue - item.detectBackgroundValue
            item.picture = item.label
            item.rateBeforeRepair = item.leakRate
            item.valueBeforeRepair = item.detectNetWorth
            item.backgroundValueBeforeRepair = item.detectBackgroundValue
            item.leakLevel = '安全'
            item.limitTime = Math.floor((item.detectEndDate - item.detectStartDate) / 1000)

            return item
        })

        if (year) detectData = lodash.filter(detectData, item => { return item.quarterCode.indexOf(year) !== -1 })
        if (quarter) detectData = lodash.filter(detectData, item => { return item.quarterCode.indexOf(quarter) !== -1 })
        if (componentType) detectData = lodash.filter(detectData, item => { return item.componentType === componentType })
        if (medium) detectData = lodash.filter(detectData, item => { return item.medium === medium })
        if (mediumStatus) detectData = lodash.filter(detectData, item => { return item.mediumStatus === mediumStatus })
        if (unreachable) detectData = lodash.filter(detectData, item => { return item.unreachable === unreachable })
        if (sealPointType) detectData = lodash.filter(detectData, item => { return item.sealPointType === sealPointType })

        ctx.body = { code: 0 , message: '导出检测数据台账成功', data: detectData }
    } catch (err) {
        logger.log('detectionDataLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '导出检测数据台账失败' }
    }
}

module.exports = {
    detectionDataLedger,
    exportDetectionDataLedger
}
