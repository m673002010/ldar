const instrumentCollection = require('../db/instrument.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryInstrument (ctx, next) {
    try {
        const { instrumentNum = '', instrument = '' } = ctx.request.query
        
        const query = {}

        if (instrumentNum) query.instrumentNum = instrumentNum
        if (instrument) query.instrument = instrument

        const data = await instrumentCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询仪器成功', data }
    } catch (err) {
        logger.log('queryInstrument异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询仪器失败' }
    }
}

async function addInstrument (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { instrumentNum = '', instrument = '', finalPrecisionTime = '', invalidTime = '', responseTime = 0 } = ctx.request.body

        const data = { instrumentNum, instrument, finalPrecisionTime: new Date(finalPrecisionTime), responseTime: +responseTime, invalidTime: new Date(invalidTime) }
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
        const { username } = ctx.userInfo
        const { _id = '', instrumentNum = '', instrument = '', finalPrecisionTime = '', invalidTime = '' , responseTime = 0 } = ctx.request.body

        await instrumentCollection.updateOne({ _id: ObjectId(_id) }, { 
            $set: { 
                instrumentNum, instrument, finalPrecisionTime: new Date(finalPrecisionTime), responseTime: +responseTime, invalidTime: new Date(invalidTime), editDate: new Date(), editUser: username 
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
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await instrumentCollection.deleteMany({ _id: { $in: _idArr } })
        
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
