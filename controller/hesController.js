async function historyEmissionStatistics (ctx, next) {
    try {
        // const { companyNum } = ctx.userInfo
        // const { year = '', quarter = '' } = ctx.request.query
        // const query = {}
        // if (year) query.year = +year
        // if (quarter) query.quarter = quarter
        // if (companyNum) query.companyNum = companyNum

        // const iDSData = await iDSCollection.find(query).toArray()

        const data = [
            { detectionCycle: '2022_第一季度', sealPoints: '1126', emissionBeforeRepair: '71.7', emissionAfterRepair: '53.28', quantityAfterRepair: '18.420', rateAfterRepair: '25.69%', startTime: '2022-01-01', endTime: '2022-03-31' },
            { detectionCycle: '2022_第二季度', sealPoints: '1126', emissionBeforeRepair: '71.7', emissionAfterRepair: '53.28', quantityAfterRepair: '18.420', rateAfterRepair: '25.69%', startTime: '2022-01-01', endTime: '2022-03-31' },
            { detectionCycle: '2022_第三季度', sealPoints: '1126', emissionBeforeRepair: '71.7', emissionAfterRepair: '53.28', quantityAfterRepair: '18.420', rateAfterRepair: '25.69%', startTime: '2022-01-01', endTime: '2022-03-31' },
            { detectionCycle: '2022_第四季度', sealPoints: '1126', emissionBeforeRepair: '71.7', emissionAfterRepair: '53.28', quantityAfterRepair: '18.420', rateAfterRepair: '25.69%', startTime: '2022-01-01', endTime: '2022-03-31' },
        ]
        
        ctx.body = { code: 0 , message: '查询数据成功', data }
    } catch (err) {
        logger.log('componentTypeEmissionAnalysis异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    historyEmissionStatistics,
}
