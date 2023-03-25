async function emissionCalculationReport (ctx, next) {
    try {
        const data = [
            { 
                num: '2023-First-Ldar-Quarter-D',
                deviceType: '化工',
                device: '苯酚回收',
                area: '苯酚回收',
                equipment: '',
                componentType: '泵',
                mediumStatus: '轻液',
                count: '4',
                leakRate: '0.000107372749',
            }
        ] 

        ctx.body = { code: 0 , message: '查询数据成功', data }
    } catch (err) {
        logger.log('emissionCalculationReport异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

module.exports = {
    emissionCalculationReport
}
