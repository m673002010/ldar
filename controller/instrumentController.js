const instrumentCollection = require('../db/instrument.js')
const lodash = require('lodash')

async function queryInstrument (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { serialNumber = '', testInstrument = '' } = ctx.request.query
        
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (serialNumber) query.serialNumber = serialNumber
        if (testInstrument) query.testInstrument = testInstrument

        const data = await instrumentCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询仪器成功', data }
    } catch (err) {
        logger.log('queryInstrument异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询仪器失败' }
    }
}

async function addInstrument (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { serialNumber = '', testInstrument = '', finalPrecisionTime = '', invalidTime = '', responseTime = '' } = ctx.request.body

        const data = { companyNum, serialNumber, testInstrument, finalPrecisionTime, responseTime, invalidTime }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })

        await instrumentCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增仪器成功' }
    } catch (err) {
        logger.log('addInstrument异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增仪器失败' }
    }
}

async function editInstrument (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { serialNumber = '', testInstrument = '', finalPrecisionTime = '', invalidTime = '' , responseTime = '' } = ctx.request.body

        await instrumentCollection.updateOne({ companyNum, serialNumber }, { 
            $set: { 
                testInstrument, finalPrecisionTime, responseTime, invalidTime, editDate: new Date(), editUser: username 
            } 
        })
        
        ctx.body = { code: 0 , message: '编辑仪器成功' }
    } catch (err) {
        logger.log('editInstrument异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑仪器失败' }
    }
}

async function deleteInstrument (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const serialNumberArr = lodash.map(deleteData, 'serialNumber')

        await instrumentCollection.deleteMany({ companyNum, serialNumber: { $in: serialNumberArr } })
        
        ctx.body = { code: 0 , message: '删除仪器成功' }
    } catch (err) {
        logger.log('deleteInstrument异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除仪器失败' }
    }
}

module.exports = {
    queryInstrument,
    addInstrument,
    editInstrument,
    deleteInstrument
}
