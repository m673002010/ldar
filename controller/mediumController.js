const mediumCollection = require('../db/medium.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryMedium (ctx, next) {
    try {
        const { mediumNum = '', medium = '' } = ctx.request.query
        const query = {}
        if (mediumNum) query.mediumNum = mediumNum
        if (medium) query.medium = medium

        const data = await mediumCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询介质成功', data }
    } catch (err) {
        logger.log('queryMedium异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询介质失败' }
    }
}

async function addMedium (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { mediumNum = '', medium = '', report = '' } = ctx.request.body

        const data = { mediumNum, medium, report }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await mediumCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增介质成功' }
    } catch (err) {
        logger.log('addMedium异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增介质失败' }
    }
}

async function editMedium (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { _id = '', mediumNum = '', medium = '', report = '' } = ctx.request.body

        await mediumCollection.updateOne({ _id: ObjectId(_id) }, { $set: { mediumNum, medium, report, editDate: new Date(), editUser: username } })
        
        ctx.body = { code: 0 , message: '编辑介质成功' }
    } catch (err) {
        logger.log('editMedium异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑介质失败' }
    }
}

async function deleteMedium (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await mediumCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除介质成功' }
    } catch (err) {
        logger.log('deleteMedium异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除介质失败' }
    }
}

module.exports = {
    queryMedium,
    addMedium,
    editMedium,
    deleteMedium
}
