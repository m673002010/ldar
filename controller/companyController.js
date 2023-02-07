const companyService = require('../service/companyService.js')

async function companyInfo (ctx, next) {
    ctx.body = await companyService.companyInfo(ctx)
}

module.exports = {
    companyInfo
}
