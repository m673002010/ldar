const meteorologyParamCollection = require('../db/meteorologyParam.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryMeteorologyParam (ctx, next) {
    try {
        const { date } = ctx.request.body

        const query = {}

        if (date && date.length) {
            const startDate = date[0]
            const endDate = date[1]
            query.date = { $gte:new Date(startDate), $lte:new Date(endDate) }
        }

        const data = await meteorologyParamCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询气象参数成功', data }
    } catch (err) {
        logger.log('queryMeteorologyParam异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询气象参数失败' }
    }
}

async function addMeteorologyParam (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { date = '', temperature = '', humidity = '', barometricPressure = '', windDirection = '', windSpeed = '' } = ctx.request.body

        const data = { date: new Date(date), temperature, humidity, barometricPressure, windDirection, windSpeed }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await meteorologyParamCollection.insertOne(data)

        ctx.body = { code: 0 , message: '新增气象参数成功' }
    } catch (err) {
        logger.log('addMeteorologyParam异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增气象参数失败' }
    }
}

async function editMeteorologyParam (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { _id = '', date = '', temperature = '', humidity = '', barometricPressure = '', windDirection = '', windSpeed = '' } = ctx.request.body

        await meteorologyParamCollection.updateOne({ _id: ObjectId(_id) }, { 
            $set: { 
                date: new Date(date), temperature, humidity, barometricPressure, windDirection, windSpeed, editDate: new Date(), editUser: username 
            }
        })

        ctx.body = { code: 0 , message: '编辑气象参数成功' }
    } catch (err) {
        logger.log('editMeteorologyParam异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑气象参数失败' }
    }
}

async function deleteMeteorologyParam (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await meteorologyParamCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除气象参数成功' }
    } catch (err) {
        logger.log('deleteMeteorologyParam异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除气象参数失败' }
    }
}

module.exports = {
    queryMeteorologyParam,
    addMeteorologyParam,
    editMeteorologyParam,
    deleteMeteorologyParam
}
