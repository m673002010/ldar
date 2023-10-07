const calibrationCollection = require('../db/calibration.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryCalibration (ctx, next) {
    try {
        const { date } = ctx.request.body

        const query = {}

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

async function addCalibration (ctx, next) {
    try {
        const { addData = [] } = ctx.request.body
        
        const data = addData.map(item => { 
            item.calibrationDate = new Date(item.calibrationDate)
            return item
        })

        await calibrationCollection.insertMany(data)
        
        ctx.body = { code: 0 , message: '添加校准数据成功' }
    } catch (err) {
        logger.log('addCalibration异常:' + err, "error")
        ctx.body = { code: -1 , message: '添加校准数据异常' }
    }
}

async function deleteCalibration (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const idArr = lodash.map(deleteData, '_id').map(id => ObjectId(id))

        await calibrationCollection.deleteMany({ _id: { $in: idArr } })
        
        ctx.body = { code: 0 , message: '删除校准数据成功' }
    } catch (err) {
        logger.log('deleteCalibration异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除校准数据失败' }
    }
}

module.exports = {
    queryCalibration,
    addCalibration,
    deleteCalibration
}
