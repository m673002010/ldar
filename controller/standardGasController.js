const standardGasCollection = require('../db/standardGas.js')
const lodash = require('lodash')

async function queryStandardGas (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { standardGasNum = '', standardGas = '' } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
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
        const { companyNum, username } = ctx.userInfo
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
            companyNum, 
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
        const { companyNum, username } = ctx.userInfo
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

        await standardGasCollection.updateOne({ companyNum, standardGasNum }, { 
            $set: { 
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
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const standardGasNumArr = lodash.map(deleteData, 'standardGasNum')

        await standardGasCollection.deleteMany({ companyNum, standardGasNum: { $in: standardGasNumArr } })
        
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
