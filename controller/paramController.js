const paramService = require('../service/paramService.js')

async function importData (ctx, next) {
    const { importData = [] } = ctx.request.body
    if (!importData || importData.length === 0) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    const res = await paramService.importData(ctx, next)
    ctx.body = res
}

async function instrumentDetectionStatistics (ctx, next) {
    const { year = '', quarter = '' } = ctx.request.query
    const query = {}
    if (year) query.year = +year
    if (quarter) query.quarter = quarter

    const res = await paramService.instrumentDetectionStatistics(query)
    ctx.body = res
}

async function deleteData (ctx, next) {
    const res = await paramService.deleteData(ctx, next)
    ctx.body = res
}

module.exports = {
    importData,
    instrumentDetectionStatistics,
    deleteData
}
