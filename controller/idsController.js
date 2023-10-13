const iDSCollection = require('../db/instrumentDetectionStatistics')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function importData (ctx, next) {
    try {
        const { importData = [] } = ctx.request.body

        await iDSCollection.insertMany(importData)
        
        ctx.body = { code: 0 , message: '导入数据成功' }
    } catch (err) {
        logger.log('importData异常:' + err, "error")
        ctx.body = { code: -1 , message: '导入数据失败' }
    }
}

async function addIds (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { 
            year = '', 
            quarter = '', 
            instrumentNum = '', 
            instrument = '', 
            model = '', 
            maintenance = '',
            quantity = '',
            calibrationUnit = '',
            certificateNum = '',
            description = '',
        } = ctx.request.body

        const data = { 
            year, 
            quarter, 
            instrumentNum, 
            instrument, 
            model, 
            maintenance,
            quantity,
            calibrationUnit,
            certificateNum,
            description,
        }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })

        await iDSCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增仪器检测统计成功' }
    } catch (err) {
        logger.log('addIds异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增仪器检测统计失败' }
    }
}

async function editIds (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { 
            _id = '', 
            year = '', 
            quarter = '', 
            instrumentNum = '', 
            instrument = '', 
            model = '', 
            maintenance = '',
            quantity = '',
            calibrationUnit = '',
            certificateNum = '',
            description = '',
        } = ctx.request.body

        await iDSCollection.updateOne({ _id: ObjectId(_id) }, { 
            $set: { 
                year, 
                quarter, 
                instrumentNum, 
                instrument, 
                model,
                maintenance,
                quantity,
                calibrationUnit,
                certificateNum,
                description,
                editDate: new Date(), 
                editUser: username 
            } 
        })
        
        ctx.body = { code: 0 , message: '编辑仪器检测统计成功' }
    } catch (err) {
        logger.log('editIds异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑仪器检测统计失败' }
    }
}

async function deleteIds (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await iDSCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除仪器检测统计成功' }
    } catch (err) {
        logger.log('deleteIds异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除仪器检测统计失败' }
    }
}

async function instrumentDetectionStatistics (ctx, next) {
    try {
        const { year = '', quarter = '' } = ctx.request.query
        const query = {}
        if (year) query.year = +year
        if (quarter) query.quarter = quarter

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
    addIds,
    editIds,
    deleteIds,
    instrumentDetectionStatistics,
    deleteData
}
