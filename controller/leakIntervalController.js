const leakIntervalCollection = require('../db/leakInterval')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function queryLeakInterval (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '' } = ctx.request.query
        const query = { companyNum }
        if (quarterCode) query.quarterCode = quarterCode

        const data = await leakIntervalCollection.find(query).toArray()

        ctx.body = { code: 0 , message: '查询泄露区间分布成功', data }
    } catch (err) {
        logger.log('queryLeakInterval异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询泄露区间分布失败' }
    }
}

async function addLeakInterval (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { 
            quarterCode = '', 
            device = '',
            detectionCount = '',
            ppm100to500 = '',
            ppm500to2000 = '',
            ppm2000to10000 = '',
            ppmMoreThan10000 = '',
            delayFix = '',
            haveFixed = '',
            nofixed = '',
        } = ctx.request.body

        const data = { 
            companyNum, 
            quarterCode, 
            device, 
            detectionCount, 
            ppm100to500,
            ppm500to2000,
            ppm2000to10000,
            ppmMoreThan10000,
            delayFix,
            haveFixed,
            nofixed,
        }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })

        await leakIntervalCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增泄露区间分布成功' }
    } catch (err) {
        logger.log('addLeakInterval异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增泄露区间分布失败' }
    }
}

async function editLeakInterval (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        Object.assign(editParams, { editDate: new Date(), editUser: username })
        await leakIntervalCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: editParams })
        
        ctx.body = { code: 0 , message: '编辑泄露区间分布成功' }
    } catch (err) {
        logger.log('editLeakInterval异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑泄露区间分布失败' }
    }
}

async function deleteLeakInterval (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await leakIntervalCollection.deleteMany({ companyNum, _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除泄露区间分布成功' }
    } catch (err) {
        logger.log('deleteLeakInterval异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除泄露区间分布失败' }
    }
}

module.exports = {
    queryLeakInterval,
    addLeakInterval,
    editLeakInterval,
    deleteLeakInterval
}
