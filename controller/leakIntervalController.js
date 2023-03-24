async function queryLeakInterval (ctx, next) {
    try {
        // const { companyNum } = ctx.userInfo
        // const { year = '', quarter = '' } = ctx.request.query
        // const query = {}
        // if (year) query.year = +year
        // if (quarter) query.quarter = quarter
        // if (companyNum) query.companyNum = companyNum

        // const iDSData = await iDSCollection.find(query).toArray()

        const data = [
            {
                device: '苯酚回收',
                dectionTotalPoint: '178',
                '100to500': '0',
                '500to2000': '0',
                '2000to10000': '0',
                'moreThan10000': '0',
                'delayedFix': '0',
                'haveFixed': '0',
                'nofixed': '0',
            }
        ] 
        
        ctx.body = { code: 0 , message: '查询数据成功', data }
    } catch (err) {
        logger.log('queryLeakInterval异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    queryLeakInterval,
}
