const companyCollection = require('../db/company')
const { ObjectId } = require('mongodb')
const lodash = require('lodash')

async function companyInfo (ctx, next) {
    try {
        const { companyNum: userCompanyNum } = ctx.userInfo
        const { companyNum = '', shortName = '' } = ctx.request.query

        const query = {}
        if (userCompanyNum === 'all') { // 标识为all可以查询所有公司
            if (companyNum) query.companyNum = companyNum
            if (shortName) query.shortName = shortName
        } else {
            query.companyNum = userCompanyNum // 只可以查询本公司
        }

        const companys = await companyCollection.find(query).toArray()

        ctx.body = { code: 0 , message: '获取公司信息成功', data: companys }
    } catch (err) {
        logger.log('companyInfo异常:' + err, 'error')
        ctx.body = { code: -1 , message: '获取公司信息失败' }
    }
}

async function queryCompany (ctx, next) {
    try {
        const { companyNum = '', fullName = '', shortName = '' } = ctx.request.query

        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (fullName) query.fullName = fullName
        if (shortName) query.shortName = shortName

        const companys = await companyCollection.find(query).toArray()

        ctx.body = { code: 0 , message: '查询公司信息成功', data: companys }
    } catch (err) {
        logger.log('queryCompany异常:' + err, 'error')
        ctx.body = { code: -1 , message: '查询公司信息失败' }
    }
}

async function addCompany (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { companyNum = '', fullName = '', shortName = '', province = ''} = ctx.request.body

        const data = { companyNum, fullName, shortName, province }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username, })

        await companyCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增公司成功' }
    } catch (err) {
        logger.log('addCompany异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增公司失败' }
    }
}

async function editCompany (ctx, next) {
    try {
        const { username } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        Object.assign(editParams, { editDate: new Date(), editUser: username })
        await companyCollection.updateOne({ _id: ObjectId(_id) }, { $set: editParams })

        ctx.body = { code: 0 , message: '编辑公司成功' }
    } catch (err) {
        logger.log('editCompany异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑公司失败' }
    }
}

async function deleteCompany (ctx, next) {
    try {
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await companyCollection.deleteMany({ _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除公司成功' }
    } catch (err) {
        logger.log('deleteCompany异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除公司失败' }
    }
}

async function dataPanel (ctx, next) {
    try {
        ctx.body =  { code: 0 , message: '数据面板展示成功', data: [] }
    } catch (err) {
        logger.log('dataPanel异常:' + err, 'error')
        ctx.body =  { code: -1 , message: '数据面板展示失败' }
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

module.exports = {
    companyInfo,
    queryCompany,
    addCompany,
    editCompany,
    deleteCompany,
    dataPanel,
    bindRegulation,
    getBindRegulation
}
