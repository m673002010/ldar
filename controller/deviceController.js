const deviceCollection = require('../db/device.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryDevice (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deviceNum = '', device = '', deviceType } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (deviceNum) query.deviceNum = deviceNum
        if (device) query.device = device
        if (deviceType) query.deviceType = deviceType

        const data = await deviceCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询装置成功', data }
    } catch (err) {
        logger.log('queryDevice异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询装置失败' }
    }
}

async function addDevice (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { deviceNum = '', device = '', deviceType = '', department = ''} = ctx.request.body

        const data = { companyNum, deviceNum, device, deviceType, department }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await deviceCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增装置成功' }
    } catch (err) {
        logger.log('addDevice异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增装置失败' }
    }
}

async function editDevice (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { _id, deviceNum = '', device = '', deviceType = '', department = '' } = ctx.request.body

        await deviceCollection.updateOne({ _id: ObjectId(_id) }, { $set: { device, deviceType, department, editDate: new Date(), editUser: username } })
        
        ctx.body = { code: 0 , message: '编辑装置成功' }
    } catch (err) {
        logger.log('editDevice异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑装置失败' }
    }
}

async function deleteDevice (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await deviceCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除装置成功' }
    } catch (err) {
        logger.log('deleteDevice异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除装置失败' }
    }
}

module.exports = {
    queryDevice,
    addDevice,
    editDevice,
    deleteDevice
}
