const componentCollection = require('../db/component')
const componentTypeCollection = require('../db/componentType')

async function componentInfoLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { 
            device = '', 
            area = '', 
            equipment = '', 
            label = '',
            unreachable = '',
            componentType = '',
            sealPointType = '',
            status = '',
            medium = '',
            currentPage = 1, 
            pageSize = 10 
        } = ctx.request.query

        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (label) query.label = label
        if (unreachable !== '2' && unreachable) query.unreachable = unreachable === '0' ? '否' : '是'
        if (componentType) query.componentType = componentType
        if (status) query.status = status
        if (medium) query.medium = medium

        console.log('============', query)

        const componentData = await componentCollection.find(query).limit(+pageSize).skip((+currentPage - 1) * pageSize).toArray()
        const total = await componentCollection.find(query).count()
        
        ctx.body = { code: 0 , message: '查询组件成功', data: { componentData, total } }
    } catch (err) {
        logger.log('componentInfoLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件失败' }
    }
}

async function exportComponentInfoLedger (ctx, next) {
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
    componentInfoLedger,
    exportComponentInfoLedger
}
