const calculationTypeCollection = require('../db/calculationType.js')
const lodash = require('lodash')

async function queryCalculationType (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { calculationTypeNum = '', calculationType = '' } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (calculationTypeNum) query.calculationTypeNum = calculationTypeNum
        if (calculationType) query.calculationType = calculationType

        const data = await calculationTypeCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询计算类型成功', data }
    } catch (err) {
        logger.log('queryCalculationType异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询计算类型失败' }
    }
}

async function addCalculationType (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { calculationTypeNum = '', calculationType = '' } = ctx.request.body

        const data = { companyNum, calculationTypeNum, calculationType }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await calculationTypeCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增计算类型成功' }
    } catch (err) {
        logger.log('addCalculationType异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增计算类型失败' }
    }
}

async function editCalculationType (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { calculationTypeNum = '', calculationType = '' } = ctx.request.body

        await calculationTypeCollection.updateOne({ companyNum, calculationTypeNum }, { $set: { calculationType, editDate: new Date(), editUser: username } })
        
        ctx.body = { code: 0 , message: '编辑计算类型成功' }
    } catch (err) {
        logger.log('editCalculationType异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑计算类型失败' }
    }
}

async function deleteCalculationType (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const calculationTypeNumArr = lodash.map(deleteData, 'calculationTypeNum')

        await calculationTypeCollection.deleteMany({ companyNum, calculationTypeNum: { $in: calculationTypeNumArr } })
        
        ctx.body = { code: 0 , message: '删除计算类型成功' }
    } catch (err) {
        logger.log('deleteCalculationType异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除计算类型失败' }
    }
}

module.exports = {
    queryCalculationType,
    addCalculationType,
    editCalculationType,
    deleteCalculationType
}
