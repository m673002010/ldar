async function historyDetectionStatistics (ctx, next) {
    try {
        // const { companyNum } = ctx.userInfo
        // const { year = '', quarter = '' } = ctx.request.query
        // const query = {}
        // if (year) query.year = +year
        // if (quarter) query.quarter = quarter
        // if (companyNum) query.companyNum = companyNum

        // const iDSData = await iDSCollection.find(query).toArray()

        const data = [
            { item: '应测', firstQuarter: '1126', secondQuarter: '5028', thirdQuarter: '1128', fourthQuarter: '5028', allYear: '12310' },
            { item: '实测', firstQuarter: '1126', secondQuarter: '5028', thirdQuarter: '1128', fourthQuarter: '5028', allYear: '12310' },
            { item: '泄漏点数', firstQuarter: '3', secondQuarter: '0', thirdQuarter: '0', fourthQuarter: '11', allYear: '14' },
            { item: '完成率', firstQuarter: '100.00%', secondQuarter: '100.00%', thirdQuarter: '100.00%', fourthQuarter: '100.00%', allYear: '100.00%' },
            { item: '泄漏率', firstQuarter: '0.27%', secondQuarter: '0.00%', thirdQuarter: '0.00%', fourthQuarter: '0.22%', allYear: '0.11%' },
            { item: '维修前排放量', firstQuarter: '71.70kg', secondQuarter: '12.94kg', thirdQuarter: '36.23kg', fourthQuarter: '47.38kg', allYear: '168.25kg' },
            { item: '维修后排放量', firstQuarter: '53.28kg', secondQuarter: '12.94kg', thirdQuarter: '36.23kg', fourthQuarter: '13.33kg', allYear: '115.78kg' },
            { item: '减排量', firstQuarter: '18.42kg', secondQuarter: '0.00kg', thirdQuarter: '0.00kg', fourthQuarter: '34.05kg', allYear: '52.47kg' },
        ] 
        
        ctx.body = { code: 0 , message: '查询数据成功', data }
    } catch (err) {
        logger.log('componentTypeEmissionAnalysis异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    historyDetectionStatistics,
}
