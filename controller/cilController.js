const componentCollection = require('../db/component')
const componentTypeCollection = require('../db/componentType')
const lodash = require('lodash')

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

        // 根据动静密封筛选
        const q = {}
        if (sealPointType) q.sealPointType = sealPointType
        let componentTypes = await componentTypeCollection.find(q).toArray()
        componentTypeArr = lodash.map(componentTypes, 'componentType')

        let componentData = await componentCollection.find(query).toArray()
        componentData = lodash.filter(componentData, c => { return componentTypeArr.includes(c.componentType) })
        const total = componentData.length
        componentData = componentData.slice((currentPage-1) * pageSize, currentPage * pageSize)
        
        ctx.body = { code: 0 , message: '查询组件成功', data: { componentData, total } }
    } catch (err) {
        logger.log('componentInfoLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件失败' }
    }
}

async function exportComponentInfoLedger (ctx, next) {
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

        // 根据动静密封筛选
        const q = {}
        if (sealPointType) q.sealPointType = sealPointType
        let componentTypes = await componentTypeCollection.find(q).toArray()
        componentTypeArr = lodash.map(componentTypes, 'componentType')

        let componentData = await componentCollection.find(query).toArray()
        componentData = lodash.filter(componentData, c => { return componentTypeArr.includes(c.componentType) })
        
        ctx.body = { code: 0 , message: '查询组件成功', data: componentData }
    } catch (err) {
        logger.log('componentInfoLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件失败' }
    }
}

module.exports = {
    componentInfoLedger,
    exportComponentInfoLedger
}
