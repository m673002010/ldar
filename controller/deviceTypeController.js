const deviceTypeCollection = require('../db/deviceType.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryDeviceType (ctx, next) {
    try {
        const { deviceTypeNum = '', deviceType = '' } = ctx.request.query
        const query = {}
        if (deviceTypeNum) query.deviceTypeNum = deviceTypeNum
        if (deviceType) query.deviceType = deviceType

        const data = await deviceTypeCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询装置类型成功', data }
    } catch (err) {
        logger.log('queryDeviceType异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询装置类型失败' }
    }
}

async function addDeviceType (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { deviceTypeNum = '', deviceType = '' } = ctx.request.body

        const data = { deviceTypeNum, deviceType, type: deviceType }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await deviceTypeCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增装置类型成功' }
    } catch (err) {
        logger.log('addDeviceType异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增装置类型失败' }
    }
}

async function editDeviceType (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { _id = '', deviceTypeNum = '', deviceType = '' } = ctx.request.body

        await deviceTypeCollection.updateOne({ _id: ObjectId(_id) }, { $set: { deviceTypeNum, deviceType, editDate: new Date(), editUser: username } })
        
        ctx.body = { code: 0 , message: '编辑装置类型成功' }
    } catch (err) {
        logger.log('editDeviceType异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑装置类型失败' }
    }
}

async function deleteDeviceType (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await deviceTypeCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除装置类型成功' }
    } catch (err) {
        logger.log('deleteDeviceType异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除装置类型失败' }
    }
}

module.exports = {
    queryDeviceType,
    addDeviceType,
    editDeviceType,
    deleteDeviceType
}
