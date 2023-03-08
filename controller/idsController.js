const iDSCollection = require('../db/instrumentDetectionStatistics')

async function importData (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { importData = [] } = ctx.request.body
        
        const data = importData.map(item => Object.assign(item, { companyNum }))

        await iDSCollection.insertMany(data)
        
        ctx.body = { code: 0 , message: '导入数据成功' }
    } catch (err) {
        logger.log('importData异常:' + err, "error")
        ctx.body = { code: -1 , message: '导入数据失败' }
    }
}

async function instrumentDetectionStatistics (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { year = '', quarter = '' } = ctx.request.query
        const query = {}
        if (year) query.year = +year
        if (quarter) query.quarter = quarter
        if (companyNum) query.companyNum = companyNum

        const iDSData = await iDSCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询数据成功', data: iDSData }
    } catch (err) {
        logger.log('instrumentDetectionStatistics异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

async function deleteData (ctx, next) {
    try {
        await iDSCollection.deleteMany()
        
        ctx.body = { code: 0 , message: '清除数据成功' }
    } catch (err) {
        logger.log('deleteData异常:' + err, "error")
        ctx.body = { code: -1 , message: '清除数据失败' }
    }
}

module.exports = {
    importData,
    instrumentDetectionStatistics,
    deleteData
}
