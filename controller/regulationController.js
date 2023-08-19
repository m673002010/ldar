const regulationCollection = require('../db/regulation.js')
const regulationComponentCollection = require('../db/regulationComponent.js')
const companyCollection = require('../db/company')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryRegulation (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { regulationCode = '', regulation = '' } = ctx.request.query
        const data = await regulationCollection.find({}).toArray()
        
        ctx.body = { code: 0 , message: '查询法规成功', data }
    } catch (err) {
        logger.log('queryRegulation异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询法规失败' }
    }
}

async function addRegulation (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { regulationCode = '', regulation = '' } = ctx.request.body

        const data = { regulationCode, regulation }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await regulationCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增法规成功' }
    } catch (err) {
        logger.log('addRegulation异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增法规失败' }
    }
}

async function editRegulation (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { regulationCode = '', regulation = '' } = ctx.request.body

        await regulationCollection.updateOne({ regulationCode }, { $set: { regulation, editDate: new Date(), editUser: username } })
        
        ctx.body = { code: 0 , message: '编辑法规成功' }
    } catch (err) {
        logger.log('editRegulation异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑法规失败' }
    }
}

async function deleteRegulation (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const regulationCodeArr = lodash.map(deleteData, 'regulationCode')

        await regulationCollection.deleteMany({ regulationCode: { $in: regulationCodeArr } })
        
        ctx.body = { code: 0 , message: '删除法规成功' }
    } catch (err) {
        logger.log('deleteRegulation异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除法规失败' }
    }
}

async function getRegulationComponent (ctx, next) {
    try {
        const { regulationCode = '' } = ctx.request.query

        const data = await regulationComponentCollection.find({ regulationCode }).toArray()
        
        ctx.body = { code: 0 , message: '获取法规组件成功', data }
    } catch (err) {
        logger.log('getRegulationComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '获取法规组件失败' }
    }
}

async function addRegulationComponent (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { regulationCode = '', detailNum = '', componentType = '', mediumStatus = '', quarter = '', threshold } = ctx.request.body

        const data = { regulationCode, detailNum, componentType, mediumStatus, quarter, threshold }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await regulationComponentCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '添加法规组件成功' }
    } catch (err) {
        logger.log('addRegulationComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '添加法规组件失败' }
    }
}

async function editRegulationComponent (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { regulationCode = '', detailNum = '', componentType = '', mediumStatus = '', quarter = '', threshold = '' } = ctx.request.body

        await regulationComponentCollection.updateOne({ regulationCode, detailNum }, { 
            $set: {
                componentType, 
                mediumStatus,
                quarter,
                threshold,
                editDate: new Date(),
                editUser: username 
            } 
        })
        
        ctx.body = { code: 0 , message: '编辑法规组件成功' }
    } catch (err) {
        logger.log('editRegulationComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑法规组件失败' }
    }
}

async function deleteRegulationComponent (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await regulationComponentCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除法规组件成功' }
    } catch (err) {
        logger.log('deleteRegulationComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除法规组件失败' }
    }
}

async function bindRegulation (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { regulationCode, regulation, unreachableCalculation } = ctx.request.body

        await companyCollection.updateOne({ companyNum }, { $set: { regulationCode, regulation, unreachableCalculation, editDate: new Date(), editUser: username } })

        ctx.body =  { code: 0 , message: '绑定法规成功' }
    } catch (err) {
        logger.log('bindRegulation异常:' + err, 'error')
        ctx.body =  { code: -1 , message: '绑定法规失败' }
    }
}

async function getBindRegulation (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo

        const data = await companyCollection.findOne({ companyNum })

        ctx.body =  { code: 0 , message: '查询绑定法规成功', data }
    } catch (err) {
        logger.log('getBindRegulation异常:' + err, 'error')
        ctx.body =  { code: -1 , message: '查询绑定法规失败' }
    }
}

async function validate (ctx, next) {
    try {
    } catch (err) {
        logger.log('validate异常:' + err, "error")
        ctx.body = { code: -1 , message: '验证法规组件失败' }
    }
}

module.exports = {
    queryRegulation,
    addRegulation,
    editRegulation,
    deleteRegulation,

    getRegulationComponent,
    addRegulationComponent,
    editRegulationComponent,
    deleteRegulationComponent,

    bindRegulation,
    getBindRegulation,

    validate
}
