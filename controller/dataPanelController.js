const componentCollection = require('../db/component')
const lodash = require('lodash')

async function pointStatic (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const data = {}
        data.totalPoint = await componentCollection.count({ companyNum })
        data.staticPoint = await componentCollection.count({ companyNum, sealPointType: '静密封' })
        data.dynamicPoint = await componentCollection.count({ companyNum, sealPointType: '动密封' })
        data.reachablePoint = await componentCollection.count({ companyNum, unreachable: '否' })
        data.unreachablePoint = await componentCollection.count({ companyNum, unreachable: '是' })
        
        ctx.body = { code: 0 , message: '点数统计成功', data }
    } catch (err) {
        logger.log('pointStatic异常:' + err, "error")
        ctx.body = { code: -1 , message: '点数统计失败' }
    }
}

async function componentType (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo

        // 按组件类型归类
        let componentData = await componentCollection.find({ companyNum }).toArray()
        componentData = lodash.groupBy(componentData, 'componentType')

        // 类型的数量
        const data = []
        for (const key in componentData) {
            data.push({ name: key, value: componentData[key].length })
        }
        
        ctx.body = { code: 0 , message: '查询组件类型数量成功', data }
    } catch (err) {
        logger.log('componentType异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件类型数量失败' }
    }
}

async function sealPointType (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo

        const staticCount = await componentCollection.count({ companyNum, sealPointType: '静密封' })
        const dynamicCount = await componentCollection.count({ companyNum, sealPointType: '动密封' })

        const data = [
            { value: dynamicCount, name: '动密封' },
            { value: staticCount, name: '静密封' }
        ]
        
        ctx.body = { code: 0 , message: '查询密封点类型数量成功', data }
    } catch (err) {
        logger.log('sealPointType异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询密封点类型数量失败' }
    }
}

module.exports = {
    pointStatic,
    componentType,
    sealPointType,
}
