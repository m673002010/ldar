const cteaCollection = require('../db/componentTypeEmissionAnalysis')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function componentTypeEmissionAnalysis (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '' } = ctx.request.query
        const query = { companyNum }
        if (quarterCode) query.quarterCode = quarterCode

        const data = await cteaCollection.find(query).toArray()

        ctx.body = { code: 0 , message: '查询组件类型排放分析成功', data }
    } catch (err) {
        logger.log('componentTypeEmissionAnalysis异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件类型排放分析失败' }
    }
}

async function addCtea (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { 
            quarterCode = '', 
            sealPointType = '',
            detectionCount = '',
            leakCount = '',
            repairCount = '',
            leakRate = '',
            leakRateAfterRepair = '',
        } = ctx.request.body

        const data = { 
            companyNum, 
            quarterCode, 
            sealPointType, 
            detectionCount, 
            leakCount, 
            repairCount, 
            leakRate, 
            leakRateAfterRepair
        }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })

        await cteaCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增组件类型排放分析成功' }
    } catch (err) {
        logger.log('addCtea异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增组件类型排放分析失败' }
    }
}

async function editCtea (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        Object.assign(editParams, { editDate: new Date(), editUser: username })
        await cteaCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: editParams })
        
        ctx.body = { code: 0 , message: '编辑组件类型排放分析成功' }
    } catch (err) {
        logger.log('editCtea异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑组件类型排放分析失败' }
    }
}

async function deleteCtea (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await cteaCollection.deleteMany({ companyNum, _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除组件类型排放分析成功' }
    } catch (err) {
        logger.log('deleteCtea异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除组件类型排放分析失败' }
    }
}

module.exports = {
    componentTypeEmissionAnalysis,
    addCtea,
    editCtea,
    deleteCtea
}
