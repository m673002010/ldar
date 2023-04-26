const componentCollection = require('../db/component')
const componentTypeCollection = require('../db/componentType')
const regulationComponentCollection = require('../db/regulationComponent')
const company = require('../db/company')
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
            mediumStatus = '',
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
        if (unreachable) query.unreachable = unreachable
        if (componentType) query.componentType = componentType
        if (mediumStatus) query.mediumStatus = mediumStatus
        if (medium) query.medium = medium
        if (sealPointType) query.sealPointType = sealPointType

        let componentData = await componentCollection.find(query).toArray()
        const total = componentData.length
        componentData = componentData.slice((currentPage-1) * pageSize, currentPage * pageSize)

        // 补充法规和检测频率信息
        const arr = []
        const regulationCode = (await company.findOne({ companyNum })).regulationCode
        const regulationComponentData = await regulationComponentCollection.find({ regulationCode }).toArray()
        for (const c of componentData) {
            for (const r of regulationComponentData) {
                if (c.componentType === r.componentType && c.mediumStatus === r.mediumStatus) {
                    Object.assign(c, { regulationCode: r.regulationCode, quarter: r.quarter })  
                }
            }
            arr.push(c)
        }
        componentData = arr

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
            mediumStatus = '',
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
        if (mediumStatus) query.mediumStatus = mediumStatus
        if (medium) query.medium = medium
        if (sealPointType) query.sealPointType = sealPointType

        let componentData = await componentCollection.find(query).toArray()
        const total = componentData.length
        componentData = componentData.slice((currentPage-1) * pageSize, currentPage * pageSize)

        // 补充法规和检测频率信息
        const arr = []
        const regulationCode = (await company.findOne({ companyNum })).regulationCode
        const regulationComponentData = await regulationComponentCollection.find({ regulationCode }).toArray()
        for (const c of componentData) {
            for (const r of regulationComponentData) {
                if (c.componentType === r.componentType && c.mediumStatus === r.mediumStatus) {
                    Object.assign(c, { regulationCode: r.regulationCode, quarter: r.quarter })  
                }
            }
            arr.push(c)
        }
        componentData = arr

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
