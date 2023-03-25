async function componentTypeEmissionAnalysis (ctx, next) {
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
                sealPointType: '泵',
                detectionNum: '4',
                leakNum: '0',
                repairNum: '0',
                leakRate: '0.0%',
                leakRateAfterRepair: '0.0%',
                leakageBeforeRepair: '0.32',
                leakageAfterRepair: '0',
                emissionReduction: '0',
            },
            {
                device: '公用工程',
                sealPointType: '泵',
                detectionNum: '1',
                leakNum: '0',
                repairNum: '0',
                leakRate: '0.0%',
                leakRateAfterRepair: '0.0%',
                leakageBeforeRepair: '0.32',
                leakageAfterRepair: '0',
                emissionReduction: '0',
            }
        ] 
        
        ctx.body = { code: 0 , message: '查询数据成功', data }
    } catch (err) {
        logger.log('componentTypeEmissionAnalysis异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    componentTypeEmissionAnalysis,
}
