const companyCollection = require('../db/company')

async function companyInfo (ctx, next) {
    try {
        const companys = await companyCollection.find().toArray()
        
        return { code: 0 , message: '获取公司信息成功', data: companys }
    } catch (err) {
        console.log('companyInfo异常:', err)
        return { code: -1 , message: '获取公司信息失败' }
    }
}

async function searchCompany (ctx, next) {
    try {
        const { companyNum = '', shortName = '' } = ctx.request.query
        const query = {}

        if (companyNum) query.companyNum = companyNum
        if (shortName) query.shortName = shortName
        
        const companys = await companyCollection.find(query).toArray()
        
        return { code: 0 , message: '搜索公司信息成功', data: companys }
    } catch (err) {
        console.log('companyInfo异常:', err)
        return { code: -1 , message: '搜索公司信息失败' }
    }
}

async function dataPanel (ctx, next) {
    try {
        return { code: 0 , message: '搜索公司信息成功', data: [] }
    } catch (err) {
        console.log('companyInfo异常:', err)
        return { code: -1 , message: '搜索公司信息失败' }
    }
}

module.exports = {
    companyInfo,
    searchCompany,
    dataPanel
}
