async function queryLeakInfoLedger (ctx, next) {
    try {
        // const { companyNum } = ctx.userInfo
        // const { year = '', quarter = '' } = ctx.request.query
        // const query = {}
        // if (year) query.year = +year
        // if (quarter) query.quarter = quarter
        // if (companyNum) query.companyNum = companyNum

        // const iDSData = await iDSCollection.find(query).toArray()

        const data = [] 
        
        ctx.body = { code: 0 , message: '查询数据成功', data }
    } catch (err) {
        logger.log('queryLeakInfoLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    queryLeakInfoLedger
}
