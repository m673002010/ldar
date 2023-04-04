const pictureLedgerCollection = require('../db/pictureLedger.js')
const componentCollection = require('../db/component')
const lodash = require('lodash')

async function componentPictureLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { picture = '' } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (picture) query.picture = picture

        const pictureData = await pictureLedgerCollection.find(query).toArray()
        const labelData = lodash.map(pictureData, 'label')
        
        ctx.body = { code: 0 , message: '查询图片成功', data: pictureData }
    } catch (err) {
        logger.log('componentPictureLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    componentPictureLedger
}
