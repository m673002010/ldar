const retestInfoCollection = require('../db/retestInfo')
const leakLedgerCollection = require('../db/leakLedger')
const componentCollection = require('../db/component')
const companyCollection = require('../db/company')
const regulationComponentCollection = require('../db/regulationComponent')
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

        const query = { companyNum }
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (date && date.length) {
            const startDate = date[0]
            const endDate = date[1]
            query.startDate = { $gte: new Date(startDate) }
            query.endDate = { $lte: new Date(endDate) }
        }
        if (detectPeople) query.detectPeople = detectPeople

        // 泄漏信息
        let leakData = await leakLedgerCollection.find(query).toArray()

        const labelExpandArr = lodash.map(leakData, 'labelExpand')
        const quarterCodeArr = lodash.map(leakData, 'quarterCode')

        // 组件信息
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()

        // 复测信息
        const retestData = await retestInfoCollection.find({ 
            companyNum, 
            labelExpand: { $in: labelExpandArr }, 
            quarterCode: { $in: quarterCodeArr } 
        }).toArray()

        // 阈值
        const regulationCode = (await companyCollection.findOne({ companyNum })).regulationCode
        const regulationComponentData = await regulationComponentCollection.find({ regulationCode }).toArray()

        // 补充组件、复测信息、阈值到检测信息
        leakData = leakData.map(item => {
            const c = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            const r = lodash.find(retestData, { 'labelExpand': item.labelExpand, 'quarterCode': item.quarterCode })
            Object.assign(item, c, r)

            const rc = lodash.find(regulationComponentData, { 'componentType': item.componentType, 'mediumStatus': item.mediumStatus })
            Object.assign(item, { threshold: rc.threshold })

            return item
        })

        leakData = leakData.map(item => {
            item.detectStartDate = item.startDate
            item.detectEndDate = item.endDate
            item.detectNetWorth = item.detectValue - item.backgroundValue

            item.isLeak = item.detectNetWorth >= item.threshold ? '是' : '否'
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

        const query = { companyNum }
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (date && date.length) {
            const startDate = date[0]
            const endDate = date[1]
            query.startDate = { $gte: new Date(startDate) }
            query.endDate = { $lte: new Date(endDate) }
        }
        if (detectPeople) query.detectPeople = detectPeople


        // 泄漏信息
        let leakData = await leakLedgerCollection.find(query).toArray()

        const labelExpandArr = lodash.map(leakData, 'labelExpand')
        const quarterCodeArr = lodash.map(leakData, 'quarterCode')

        // 组件信息
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()

        // 复测信息
        const retestData = await retestInfoCollection.find({ 
            companyNum, 
            labelExpand: { $in: labelExpandArr }, 
            quarterCode: { $in: quarterCodeArr } 
        }).toArray()

        // 阈值
        const regulationCode = (await companyCollection.findOne({ companyNum })).regulationCode
        const regulationComponentData = await regulationComponentCollection.find({ regulationCode }).toArray()

        // 补充组件、复测信息、阈值到检测信息
        leakData = leakData.map(item => {
            const c = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            const r = lodash.find(retestData, { 'labelExpand': item.labelExpand, 'quarterCode': item.quarterCode })
            Object.assign(item, c, r)

            const rc = lodash.find(regulationComponentData, { 'componentType': item.componentType, 'mediumStatus': item.mediumStatus })
            Object.assign(item, { threshold: rc.threshold })

            // 导出表格字段调整
            item.detectStartDate = item.startDate
            item.detectEndDate = item.endDate
            item.detectNetWorth = item.detectValue - item.backgroundValue
            
            item.isLeak = item.detectNetWorth >= item.threshold ? '是' : '否'
            item.leakLevel = '安全'
            
            item.picture = item.label
            item.rateBeforeRepair = item.leakRate
            item.valueBeforeRepair = item.detectNetWorth
            item.backgroundValueBeforeRepair = item.backgroundValue

            return item
        })

        if (year) leakData = lodash.filter(leakData, item => { return item.quarterCode.indexOf(year) !== -1 })
        if (quarter) leakData = lodash.filter(leakData, item => { return item.quarterCode.indexOf(quarterMap[quarter]) !== -1 })
        if (componentType) leakData = lodash.filter(leakData, item => { return item.componentType === componentType })
        if (sealPointType) leakData = lodash.filter(leakData, item => { return item.sealPointType === sealPointType })

        ctx.body = { code: 0 , message: '导出泄漏信息台账成功', data: leakData }
    } catch (err) {
        logger.log('queryLeakInfoLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '导出泄漏信息台账失败' }
    }
}

module.exports = {
    queryLeakInfoLedger,
    exportLeakInfoLedger
}
