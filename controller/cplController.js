const pictureLedgerCollection = require('../db/pictureLedger.js')
const componentCollection = require('../db/component')
const lodash = require('lodash')

async function componentPictureLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { device = '', area = '', equipment = '', quarter = '', currentPage = 1, pageSize = 10} = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        // if (quarter) query.quarter = quarter

        const componentData = await componentCollection.find(query).limit(+pageSize).skip((+currentPage - 1) * pageSize).toArray()
        const total = await componentCollection.find(query).count()
        const labelData = componentData.map(item => {
            const obj = { 
                label: item.label,
                picture: item.label,
                medium: item.medium,
                location: item.location,
                device: item.device,
                area: item.area,
                equipment: item.equipment,
            }
            return obj
        })
        
        ctx.body = { code: 0 , message: '查询图片成功', data: { labelData, total } }
    } catch (err) {
        logger.log('componentPictureLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    componentPictureLedger
}
