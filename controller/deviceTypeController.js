const deviceTypeCollection = require('../db/deviceType.js')
const lodash = require('lodash')

async function queryDeviceType (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deviceTypeNum = '', deviceType = '' } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
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
        const { companyNum, username } = ctx.userInfo
        const { deviceTypeNum = '', deviceType = '' } = ctx.request.body

        const data = { companyNum, deviceTypeNum, deviceType, type: deviceType }
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
        const { companyNum, username } = ctx.userInfo
        const { deviceTypeNum = '', deviceType = '' } = ctx.request.body

        await deviceTypeCollection.updateOne({ companyNum, deviceTypeNum }, { $set: { deviceType, editDate: new Date(), editUser: username } })
        
        ctx.body = { code: 0 , message: '编辑装置类型成功' }
    } catch (err) {
        logger.log('editDeviceType异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑装置类型失败' }
    }
}

async function deleteDeviceType (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const deviceTypeNumArr = lodash.map(deleteData, 'deviceTypeNum')

        await deviceTypeCollection.deleteMany({ companyNum, deviceTypeNum: { $in: deviceTypeNumArr } })
        
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
