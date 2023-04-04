const pictureLedgerCollection = require('../db/pictureLedger.js')

async function componentPictureLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { picture = '' } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (picture) query.picture = picture

        const data = await pictureLedgerCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询图片成功', data }
    } catch (err) {
        logger.log('componentPictureLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    componentPictureLedger
}
