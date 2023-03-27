async function componentPictureLedger (ctx, next) {
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
                label: 'L-00001',
                picture: 'L-00001',
                medium: '苯酚',
                location: '西南',
                device: '苯酚回收',
                area: '苯酚回收',
                equipment: 'T-406',
            },
            {
                label: 'L-00002',
                picture: 'L-00002',
                medium: '苯酚',
                location: '西南',
                device: '苯酚回收',
                area: '苯酚回收',
                equipment: 'T-406',
            }
        ]
        
        ctx.body = { code: 0 , message: '查询数据成功', data }
    } catch (err) {
        logger.log('componentPictureLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    componentPictureLedger
}
