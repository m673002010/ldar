const hesCollection = require('../db/historyEmissionStatistics')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function historyEmissionStatistics (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { year = '' } = ctx.request.query
        const query = { companyNum }

        let data = await hesCollection.find(query).toArray()
        if (year) data = lodash.filter(data, item => { return item.detectionCycle.indexOf(year) !== -1 })
        
        ctx.body = { code: 0 , message: '历史排放统计查询成功', data }
    } catch (err) {
        logger.log('historyEmissionStatistics异常:' + err, "error")
        ctx.body = { code: -1 , message: '历史排放统计查询失败' }
    }
}

async function addHes (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { 
            detectionCycle = '', 
            sealPoints = '', 
            emissionBeforeRepair = '', 
            emissionAfterRepair = '',
            decreaseAfterRepair = '',
            decreaseRateAfterRepair = '',
            startTime = '',
            endTime = '',
        } = ctx.request.body

        const data = {
            companyNum,
            detectionCycle, 
            sealPoints, 
            emissionBeforeRepair, 
            emissionAfterRepair, 
            decreaseAfterRepair, 
            decreaseRateAfterRepair,
            startTime,
            endTime,
        }

        await hesCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增历史排放统计成功', data }
    } catch (err) {
        logger.log('addHes异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增历史排放统计失败' }
    }
}

async function editHes (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        await hesCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: editParams })

        ctx.body = { code: 0 , message: '编辑历史排放统计成功' }
    } catch (err) {
        logger.log('editHes异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑历史排放统计失败' }
    }
}

async function deleteHes (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await hesCollection.deleteMany({ companyNum, _id: { $in: _idArr } })

        ctx.body = { code: 0 , message: '删除历史排放统计成功' }
    } catch (err) {
        logger.log('deleteHes异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除历史排放统计失败' }
    }
}

module.exports = {
    historyEmissionStatistics,
    addHes,
    editHes,
    deleteHes
}
