const ecrCollection = require('../db/emissionCalculationReport.js')
const { ObjectId } = require('mongodb')
const lodash = require('lodash')

async function emissionCalculationReport (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '', repairBeforeAfter = '' } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (quarterCode) query.quarterCode = quarterCode
        if (repairBeforeAfter) query.repairBeforeAfter = repairBeforeAfter

        const data = await ecrCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询排放量计算成功', data }
    } catch (err) {
        logger.log('emissionCalculationReport异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询排放量计算失败' }
    }
}

async function addEcr (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { 
            quarterCode = '', 
            repairBeforeAfter = '',
            device = '',
            deviceType = '',
            area = '',
            equipment = '',
            componentType = '',
            mediumStatus = '',
            count = '',
            leakRate = '',
        } = ctx.request.body

        const data = { companyNum, quarterCode, repairBeforeAfter, device, deviceType, area, equipment, componentType, mediumStatus, count, leakRate }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })

        await ecrCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增排放量计算成功' }
    } catch (err) {
        logger.log('addEcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增排放量计算失败' }
    }
}

async function editEcr (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        Object.assign(editParams, { editDate: new Date(), editUser: username })
        await ecrCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: editParams })
        
        ctx.body = { code: 0 , message: '编辑排放量计算成功' }
    } catch (err) {
        logger.log('editEcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑排放量计算失败' }
    }
}

async function deleteEcr (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await ecrCollection.deleteMany({ companyNum, _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除排放量计算成功' }
    } catch (err) {
        logger.log('deleteEcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除排放量计算失败' }
    }
}

module.exports = {
    emissionCalculationReport,
    addEcr,
    editEcr,
    deleteEcr
}
