const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const pictureLedgerCollection = require('../db/pictureLedger.js')
const lodash = require('lodash')

const quarterMap = {
    '第1季度': 'First-Ldar-Quarter',
    '第2季度': 'Second-Ldar-Quarter',
    '第3季度': 'Third-Ldar-Quarter',
    '第4季度': 'Fourth-Ldar-Quarter',
}

async function queryLeakInfoLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const {
            year = '',
            quarter = '', 
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

        const query = { companyNum, isLeak: '是' }
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (date && date.length) {
            query.detectStartDate = { $gte: new Date(date[0]) }
            query.detectEndDate = { $lte: new Date(date[1]) }
        }
        if (detectPeople) query.detectPeople = detectPeople

        // 泄漏信息
        let leakData = await detectLedgerCollection.find(query).toArray()

         // 补充图片信息
        const pictures = await pictureLedgerCollection.find({ companyNum }).toArray()

        // 补充组件信息
        const labelExpandArr = lodash.map(leakData, 'labelExpand')
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        leakData = leakData.map(item => {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            Object.assign(item, component)

            const pic = lodash.find(pictures, { 'label': item.label })
            Object.assign(item, { picturePath: pic.picturePath})

            item.detectNetWorth = item.detectValue - item.detectBackgroundValue
            item.leakLevel = '安全'

            return item
        })

        if (year) leakData = lodash.filter(leakData, item => { return item.quarterCode.indexOf(year) !== -1 })
        if (quarter) leakData = lodash.filter(leakData, item => { return item.quarterCode.indexOf(quarterMap[quarter]) !== -1 })
        if (componentType) leakData = lodash.filter(leakData, item => { return item.componentType === componentType })
        if (sealPointType) leakData = lodash.filter(leakData, item => { return item.sealPointType === sealPointType })

        const total = leakData.length
        leakData = leakData.slice((currentPage-1) * pageSize, currentPage * pageSize)

        ctx.body = { code: 0 , message: '查询泄漏信息台账成功', data: { leakData, total } }
    } catch (err) {
        logger.log('queryLeakInfoLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询泄漏信息台账失败' }
    }
}

async function exportLeakInfoLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { 
            year = '',
            quarter = '', 
            date = null, 
            device = '',
            area = '',
            equipment = '',
            componentType = '',
            sealPointType = '',
            detectPeople = '',
        } = ctx.request.body

        const query = { companyNum, isLeak: '是' }
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (date && date.length) {
            query.startDate = { $gte: new Date(date[0]) }
            query.endDate = { $lte: new Date(date[1]) }
        }
        if (detectPeople) query.detectPeople = detectPeople


        // 泄漏信息
        let leakData = await detectLedgerCollection.find(query).toArray()

        // 补充组件信息
        const labelExpandArr = lodash.map(leakData, 'labelExpand')
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        leakData = leakData.map(item => {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            Object.assign(item, component)

            // 导出表格字段调整
            item.detectNetWorth = item.detectValue - item.detectBackgroundValue
            item.picture = item.label
            item.rateBeforeRepair = item.leakRate
            item.valueBeforeRepair = item.detectNetWorth
            item.backgroundValueBeforeRepair = item.detectBackgroundValue
            item.leakLevel = '安全'

            return item
        })

        if (year) leakData = lodash.filter(leakData, item => { return item.quarterCode.indexOf(year) !== -1 })
        if (quarter) leakData = lodash.filter(leakData, item => { return item.quarterCode.indexOf(quarterMap[quarter]) !== -1 })
        if (componentType) leakData = lodash.filter(leakData, item => { return item.componentType === componentType })
        if (sealPointType) leakData = lodash.filter(leakData, item => { return item.sealPointType === sealPointType })

        ctx.body = { code: 0 , message: '导出泄漏信息台账成功', data: leakData }
    } catch (err) {
        logger.log('exportLeakInfoLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '导出泄漏信息台账失败' }
    }
}

module.exports = {
    queryLeakInfoLedger,
    exportLeakInfoLedger
}
