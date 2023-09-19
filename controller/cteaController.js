const cteaCollection = require('../db/componentTypeEmissionAnalysis')
const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
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

async function statisticCtea (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '' } = ctx.request.body

        if (!quarterCode) {
            ctx.body = { code: -1 , message: '缺少周期参数' }
            return
        }

        // 检测数据
        let detectData = await detectLedgerCollection.find({ companyNum, quarterCode }).toArray()

        // 补充组件信息
        const labelExpandArr = lodash.map(detectData, 'labelExpand')
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        detectData = detectData.map(item => {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            if (component) delete component._id
            Object.assign(item, component)

            return item
        })

        // 根据密封点类型汇总分类数据
        const sealPointTypeMap = lodash.groupBy(detectData, 'sealPointType')

        const cteaData = []
        for (const key in sealPointTypeMap) {
            const obj = {}
            obj.companyNum = companyNum
            obj.quarterCode = quarterCode
            obj.sealPointType = key
            obj.detectionCount = sealPointTypeMap[key].length
            obj.leakCount = obj.repairCount = 0 

            for (const item of sealPointTypeMap[key]) {
                if (item.isLeak === '是') obj.leakCount++
                if (item.retestValue && item.retestBackgroundValue && item.retestValue - item.retestBackgroundValue <= item.threshold) obj.repairCount++
            }

            obj.leakRate = (obj.leakCount / obj.detectionCount * 100).toFixed(2) + '%'
            obj.leakRateAfterRepair = ((obj.leakCount - obj.repairCount) / obj.detectionCount * 100).toFixed(2) + '%'

            cteaData.push(obj)
        }

        await cteaCollection.deleteMany({ companyNum, quarterCode })
        await cteaCollection.insertMany(cteaData)

        ctx.body = { code: 0 , message: '统计组件类型排放分析成功' }
    } catch (err) {
        logger.log('statisticCtea异常:' + err, "error")
        ctx.body = { code: -1 , message: '统计组件类型排放分析失败' }
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
    statisticCtea,
    addCtea,
    editCtea,
    deleteCtea
}
