const retestInfoCollection = require('../db/retestInfo')
const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')

async function queryRetestInfo (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { device = '', area = '', equipment = '', componentType = '', isLeak = '', isDelayRepair = '' } = ctx.request.query

        const query = { companyNum }
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        // if (componentType) query.componentType = componentType
        // if (isLeak) query.isLeak = isLeak
        if (isDelayRepair) query.isDelayRepair = isDelayRepair

        const retestInfoData = await retestInfoCollection.find(query).toArray()

        ctx.body = { code: 0 , message: '查询复测信息成功', data: retestInfoData }
    } catch (err) {
        logger.log('queryRetestInfo异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询复测信息失败' }
    }
}

async function importRetestInfo (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '', importData = [] } = ctx.request.body

        const data = importData.map(item => {
            item.companyNum = companyNum
            item.quarterCode = quarterCode
            item.labelExpand = item.label + '-' + item.expand
            item.repairEndDate = new Date(item.repairEndDate)
            item.retestStartDate = new Date(item.retestStartDate)
            item.retestEndDate = new Date(item.retestEndDate)
            item.planRepairDate = new Date(item.planRepairDate)

            return item
        })
        await retestInfoCollection.insertMany(data)

        ctx.body = { code: 0 , message: '导入复测信息成功' }
    } catch (err) {
        logger.log('importRetestInfo异常:' + err, "error")
        ctx.body = { code: -1 , message: '导入复测信息失败' }
    }
}

module.exports = {
    queryRetestInfo,
    importRetestInfo
}
