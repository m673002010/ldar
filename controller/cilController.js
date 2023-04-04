const componentCollection = require('../db/component')

async function componentInfoLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { device = '', area = '', equipment = '' } = ctx.request.query

        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment

        const data = await componentCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询组件成功', data }
    } catch (err) {
        logger.log('componentInfoLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件失败' }
    }
}

module.exports = {
    componentInfoLedger
}
