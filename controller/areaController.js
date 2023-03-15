const areaCollection = require('../db/area.js')
const lodash = require('lodash')

async function queryArea (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { areaNum = '', area = '', deviceNum, device } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (areaNum) query.areaNum = areaNum
        if (area) query.area = area
        if (deviceNum) query.deviceNum = deviceNum
        if (device) query.device = device

        const data = await areaCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询区域成功', data }
    } catch (err) {
        logger.log('queryArea异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询区域失败' }
    }
}

async function addArea (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { areaNum = '', area = '', deviceNum = '', device = '' } = ctx.request.body

        const data = { companyNum, areaNum, area, deviceNum, device }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await areaCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增区域成功' }
    } catch (err) {
        logger.log('addArea异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增区域失败' }
    }
}

async function editArea (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { areaNum = '', area = '', deviceNum = '', device = '' } = ctx.request.body

        await areaCollection.updateOne({ companyNum, areaNum }, { $set: { area, deviceNum, device, editDate: new Date(), editUser: username } })
        
        ctx.body = { code: 0 , message: '编辑区域成功' }
    } catch (err) {
        logger.log('editArea异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑区域失败' }
    }
}

async function deleteArea (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const areaNumArr = lodash.map(deleteData, 'areaNum')

        await areaCollection.deleteMany({ companyNum, areaNum: { $in: areaNumArr } })
        
        ctx.body = { code: 0 , message: '删除区域成功' }
    } catch (err) {
        logger.log('deleteArea异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除区域失败' }
    }
}

module.exports = {
    queryArea,
    addArea,
    editArea,
    deleteArea
}
