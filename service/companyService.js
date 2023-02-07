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

module.exports = {
    companyInfo
}
