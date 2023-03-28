const regulationCollection = require('../db/regulation.js')
const lodash = require('lodash')

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

module.exports = {
    queryRegulation,
    addRegulation,
    editRegulation,
    deleteRegulation
}
