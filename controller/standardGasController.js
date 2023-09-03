const standardGasCollection = require('../db/standardGas.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryStandardGas (ctx, next) {
    try {
        const { standardGasNum = '', standardGas = '' } = ctx.request.query
        const query = {}

        if (standardGasNum) query.standardGasNum = standardGasNum
        if (standardGas) query.standardGas = standardGas

        const data = await standardGasCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询标准气成功', data }
    } catch (err) {
        logger.log('queryStandardGas异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询标准气失败' }
    }
}

async function addStandardGas (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { 
            standardGasNum = '', 
            standardGas = '', 
            dailyCalibration = '',
            needDriftCalibration = '',
            type = '',
            standardGasActual = '',
            standardGasTheory = '',
            validTime = '',
            stopUse = '',
        } = ctx.request.body

        const data = {
            standardGasNum, 
            standardGas,
            dailyCalibration,
            needDriftCalibration,
            type,
            standardGasActual,
            standardGasTheory,
            validTime: new Date(validTime),
            stopUse,
        }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await standardGasCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增标准气成功' }
    } catch (err) {
        logger.log('addStandardGas异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增标准气失败' }
    }
}

async function editStandardGas (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const {
            _id = '',
            standardGasNum = '', 
            standardGas = '', 
            dailyCalibration = '',
            needDriftCalibration = '',
            type = '',
            standardGasActual = '',
            standardGasTheory = '',
            validTime = '',
            stopUse = '',
        } = ctx.request.body

        await standardGasCollection.updateOne({ _id: ObjectId(_id) }, { 
            $set: {
                standardGasNum,
                standardGas, 
                dailyCalibration,
                needDriftCalibration,
                type,
                standardGasActual,
                standardGasTheory,
                validTime: new Date(validTime),
                stopUse,
                editDate: new Date(), 
                editUser: username 
            } 
        })
        
        ctx.body = { code: 0 , message: '编辑标准气成功' }
    } catch (err) {
        logger.log('editStandardGas异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑标准气失败' }
    }
}

async function deleteStandardGas (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await standardGasCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除标准气成功' }
    } catch (err) {
        logger.log('deleteStandardGas异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除标准气失败' }
    }
}

module.exports = {
    queryStandardGas,
    addStandardGas,
    editStandardGas,
    deleteStandardGas
}
