const equipmentCollection = require('../db/equipment.js')
const lodash = require('lodash')

async function queryEquipment (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { equipmentNum = '', equipment = '', deviceNum = '', areaNum = '' } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (equipmentNum) query.equipmentNum = equipmentNum
        if (equipment) query.equipment = equipment
        if (deviceNum) query.deviceNum = deviceNum
        if (areaNum) query.areaNum = areaNum

        const data = await equipmentCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询设备成功', data }
    } catch (err) {
        logger.log('queryEquipment异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询设备失败' }
    }
}

async function addEquipment (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { equipmentNum = '', equipment = '', deviceNum = '', device = '', areaNum = '', area = '' } = ctx.request.body

        const data = { companyNum, equipmentNum, equipment, deviceNum, device, areaNum, area }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await equipmentCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增设备成功' }
    } catch (err) {
        logger.log('addEquipment异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增设备失败' }
    }
}

async function editEquipment (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { equipmentNum = '', equipment = '', deviceNum = '', device = '', areaNum = '', area = '' } = ctx.request.body

        await equipmentCollection.updateOne({ companyNum, equipmentNum }, { 
            $set: { 
                equipment, deviceNum, device, areaNum, area, editDate: new Date(), editUser: username 
            } 
        })
        
        ctx.body = { code: 0 , message: '编辑设备成功' }
    } catch (err) {
        logger.log('editEquipment异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑设备失败' }
    }
}

async function deleteEquipment (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const equipmentNumArr = lodash.map(deleteData, 'equipmentNum')

        await equipmentCollection.deleteMany({ companyNum, equipmentNum: { $in: equipmentNumArr } })
        
        ctx.body = { code: 0 , message: '删除设备成功' }
    } catch (err) {
        logger.log('deleteEquipment异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除设备失败' }
    }
}

module.exports = {
    queryEquipment,
    addEquipment,
    editEquipment,
    deleteEquipment
}
