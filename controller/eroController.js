const retestInfoCollection = require('../db/retestInfo')
const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const companyCollection = require('../db/company')
const regulationComponentCollection = require('../db/regulationComponent')
const lodash = require('lodash')

async function queryRepairInfo (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { device = '', area = '', equipment = '', componentType = '', isLeak = '', isDelayRepair = '', date } = ctx.request.body

        const query = { companyNum }
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (isDelayRepair) query.isDelayRepair = isDelayRepair
        if (date && date.length) {
            const startDate = date[0]
            const endDate = date[1]
            query.retestStartDate = { $gte: new Date(startDate) }
            query.retestEndDate = { $lte: new Date(endDate) }
        }

        let retestInfoData = await retestInfoCollection.find(query).toArray()

        const labelExpandArr = lodash.map(retestInfoData, 'labelExpand')
        const quarterCodeArr = lodash.map(retestInfoData, 'quarterCode')

        // 组件信息
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()

        // 检测信息
        let detectData = await detectLedgerCollection.find({ 
            companyNum, 
            labelExpand: { $in: labelExpandArr }, 
            quarterCode: { $in: quarterCodeArr } 
        }).toArray()

        // 阈值
        const regulationCode = (await companyCollection.findOne({ companyNum })).regulationCode
        const regulationComponentData = await regulationComponentCollection.find({ regulationCode }).toArray()

        detectData = detectData.map(item => {
            item.detectStartDate = item.startDate
            item.detectEndDate = item.endDate
            item.detectBackgroundValue = item.backgroundValue 
            item.detectNetWorth = item.detectValue - item.backgroundValue

            return item
        })

        // 补充信息
        retestInfoData = retestInfoData.map(item => {
            const c = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            const d = lodash.find(detectData, { 'labelExpand': item.labelExpand, 'quarterCode': item.quarterCode })

            Object.assign(item, c, d)

            const r = lodash.find(regulationComponentData, { 'componentType': item.componentType, 'mediumStatus': item.mediumStatus })

            Object.assign(item, { threshold: r.threshold })

            item.isLeak = item.detectValue >= item.threshold ? '是' : '否'

            return item
        })

        if (componentType) retestInfoData = lodash.filter(retestInfoData, item => { return item.componentType === componentType })
        if (isLeak) retestInfoData = lodash.filter(retestInfoData, item => { return item.isLeak === isLeak })

        ctx.body = { code: 0 , message: '查询复测信息成功', data: retestInfoData }
    } catch (err) {
        logger.log('queryRepairInfo异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询复测信息失败' }
    }
}

async function exportRetestTask (ctx, next) {
    try {
        return this.queryRepairInfo(ctx, next)
    } catch (err) {
        logger.log('exportRetestTask异常:' + err, "error")
        ctx.body = { code: -1 , message: '导出复测任务失败' }
    }
}

module.exports = {
    queryRepairInfo,
    exportRetestTask
}
