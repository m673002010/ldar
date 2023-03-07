const iDSCollection = require('../db/param/instrumentDetectionStatistics')

async function importData (ctx, next) {
    try {
        const { importData = [] } = ctx.request.body
        await iDSCollection.insertMany(importData)
        
        return { code: 0 , message: '导入数据成功' }
    } catch (err) {
        console.log('importData异常:', err)
        return { code: -1 , message: '导入数据失败' }
    }
}

async function instrumentDetectionStatistics (query) {
    try {
        const iDSData = await iDSCollection.find(query).toArray()
        
        return { code: 0 , message: '查询数据成功', data: iDSData }
    } catch (err) {
        console.log('instrumentDetectionStatistics异常:', err)
        return { code: -1 , message: '查询数据失败' }
    }
}

async function deleteData (ctx, next) {
    try {
        await iDSCollection.deleteMany()
        
        return { code: 0 , message: '清除数据成功' }
    } catch (err) {
        console.log('deleteData异常:', err)
        return { code: -1 , message: '清除数据失败' }
    }
}

module.exports = {
    importData,
    instrumentDetectionStatistics,
    deleteData
}
