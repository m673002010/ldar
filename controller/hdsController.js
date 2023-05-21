const hdsCollection = require('../db/historyDetectionStatistics')
const lodash = require('lodash')
const { ObjectId } = require('mongodb')

async function historyDetectionStatistics (ctx, next) {
    try {
        const { companyNum, year } = ctx.userInfo
        const query = { companyNum }

        let data = await hdsCollection.find(query).toArray()
        if (year) data = lodash.filter(data, item => { return item.detectionCycle.indexof(year) !== -1 })
        
        ctx.body = { code: 0 , message: '历史检测统计查询成功', data }
    } catch (err) {
        logger.log('historyEmissionStatistics异常:' + err, "error")
        ctx.body = { code: -1 , message: '历史检测统计查询失败' }
    }
}

async function addHds (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { 
            detectionCycle = '', 
            shouldDetect = '', 
            hasDetect = '', 
            leakPoint = '',
            finishRatio = '',
            leakRatio = '',
            emissionBeforeRepair = '',
            emissionAfterRepair = '',
            decrease = ''
        } = ctx.request.body

        const data = {
            companyNum,
            detectionCycle, 
            shouldDetect, 
            hasDetect, 
            leakPoint, 
            finishRatio, 
            leakRatio,
            emissionBeforeRepair,
            emissionAfterRepair,
            decrease,
        }

        await hdsCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增历史检测统计成功', data }
    } catch (err) {
        logger.log('addHds异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增历史检测统计失败' }
    }
}

async function editHds (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        await hdsCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: editParams })

        ctx.body = { code: 0 , message: '编辑历史检测统计成功' }
    } catch (err) {
        logger.log('editHds异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑历史检测统计失败' }
    }
}

async function deleteHds (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await hdsCollection.deleteMany({ companyNum, _id: { $in: _idArr } })

        ctx.body = { code: 0 , message: '删除历史检测统计成功' }
    } catch (err) {
        logger.log('deleteHds异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除历史检测统计失败' }
    }
}

module.exports = {
    historyDetectionStatistics,
    addHds,
    editHds,
    deleteHds
}
