const componentTypeCollection = require('../db/componentType.js')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryComponentType (ctx, next) {
    try {
        const { componentTypeNum = '', componentType = '', calculationType = '', sealPointType = '' } = ctx.request.query
        const query = {}
        if (componentTypeNum) query.componentTypeNum = componentTypeNum
        if (componentType) query.componentType = componentType
        if (calculationType) query.calculationType = calculationType
        if (sealPointType) query.sealPointType = sealPointType

        const data = await componentTypeCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询组件类型成功', data }
    } catch (err) {
        logger.log('queryComponentType异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件类型失败' }
    }
}

async function addComponentType (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { componentTypeNum = '', componentType = '', calculationType = '', sealPointType = '' } = ctx.request.body

        const data = { componentTypeNum, componentType, calculationType, sealPointType }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await componentTypeCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增组件类型成功' }
    } catch (err) {
        logger.log('addComponentType异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增组件类型失败' }
    }
}

async function editComponentType (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { _id = '', componentTypeNum = '', componentType = '', calculationType = '', sealPointType = '' } = ctx.request.body

        await componentTypeCollection.updateOne({ _id: ObjectId(_id) }, { $set: { componentTypeNum, componentType, calculationType, sealPointType, editDate: new Date(), editUser: username } })
        
        ctx.body = { code: 0 , message: '编辑组件类型成功' }
    } catch (err) {
        logger.log('editComponentType异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑组件类型失败' }
    }
}

async function deleteComponentType (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await componentTypeCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除组件类型成功' }
    } catch (err) {
        logger.log('deleteComponentType异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除组件类型失败' }
    }
}

module.exports = {
    queryComponentType,
    addComponentType,
    editComponentType,
    deleteComponentType
}
