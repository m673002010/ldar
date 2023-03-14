const calibrationCollection = require('../db/calibration.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')


async function queryCalibration (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { date } = ctx.request.body

        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (date && date.length) {
            const startDate = date[0]
            const endDate = date[1]
            query.calibrationDate = { $gte:new Date(startDate), $lte:new Date(endDate) }
        }

        const data = await calibrationCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询校准数据成功', data }
    } catch (err) {
        logger.log('queryCalibration异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询校准数据失败' }
    }
}

async function importCalibration (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { importData = [] } = ctx.request.body

        console.log()
        
        const data = importData.map(item => { 
            Object.assign(item, { companyNum })
            item.calibrationDate = new Date(item.calibrationDate)
            return item
        })

        await calibrationCollection.insertMany(data)
        
        ctx.body = { code: 0 , message: '导入校准数据成功' }
    } catch (err) {
        logger.log('importCalibration异常:' + err, "error")
        ctx.body = { code: -1 , message: '导入校准数据异常' }
    }
}

async function deleteCalibration (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const idArr = lodash.map(deleteData, '_id').map(id => ObjectId(id))

        await calibrationCollection.deleteMany({ companyNum, _id: { $in: idArr } })
        
        ctx.body = { code: 0 , message: '删除校准数据成功' }
    } catch (err) {
        logger.log('deleteCalibration异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除校准数据失败' }
    }
}

module.exports = {
    queryCalibration,
    importCalibration,
    deleteCalibration
}
