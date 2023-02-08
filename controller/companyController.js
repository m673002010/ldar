const companyService = require('../service/companyService.js')

async function companyInfo (ctx, next) {
    ctx.body = await companyService.companyInfo(ctx)
}

async function searchCompany (ctx, next) {
    ctx.body = await companyService.searchCompany(ctx)
}

async function dataPanel (ctx, next) {
    ctx.body = await companyService.dataPanel(ctx)
}

module.exports = {
    companyInfo,
    searchCompany,
    dataPanel
}
