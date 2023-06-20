const icrCollection = require('../db/instrumentCalibrationRecord.js')
const { ObjectId } = require('mongodb')
const lodash = require('lodash')

async function instrumentCalibrationRecord (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { date } = ctx.request.body
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (date && date.length) {
            const startDate = date[0]
            const endDate = date[1]
            query.calibrationDate = { $gte:new Date(startDate), $lte:new Date(endDate) }
        }

        const data = await icrCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询仪器校准成功', data }
    } catch (err) {
        logger.log('instrumentCalibrationRecord异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询数据失败' }
    }
}

async function addIcr (ctx, next) {
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

        await icrCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增仪器校准成功' }
    } catch (err) {
        logger.log('addEcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增仪器校准失败' }
    }
}

async function editIcr (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        Object.assign(editParams, { editDate: new Date(), editUser: username })
        await icrCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: editParams })
        
        ctx.body = { code: 0 , message: '编辑仪器校准成功' }
    } catch (err) {
        logger.log('editEcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑仪器校准失败' }
    }
}

async function deleteIcr (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await icrCollection.deleteMany({ companyNum, _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除仪器校准成功' }
    } catch (err) {
        logger.log('deleteEcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除仪器校准失败' }
    }
}


module.exports = {
    instrumentCalibrationRecord,
    addIcr,
    editIcr,
    deleteIcr
}
