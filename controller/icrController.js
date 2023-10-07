// const icrCollection = require('../db/instrumentCalibrationRecord.js')
const calibrationCollection = require('../db/calibration.js')
const { ObjectId } = require('mongodb')
const lodash = require('lodash')

async function instrumentCalibrationRecord (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { date } = ctx.request.body
        const query = {}

        if (date && date.length) {
            const startDate = date[0]
            const endDate = date[1]
            query.calibrationDate = { $gte:new Date(startDate), $lte:new Date(endDate) }
        }

        // 校准管理的数据
        const result = await calibrationCollection.find(query).toArray()

        // 根据委托编号划分
        const map = {}
        for (const item of result) {
            const consignID = item.consignID
            if (!consignID) continue
            if (!map[consignID]) map[consignID] = {}
            map[consignID].calibrationDate = item.calibrationDate
            map[consignID].instrumentNum = item.instrumentNum
            map[consignID].calibrationPeople = item.calibrationPeople

            if (item.standardGas === 'O2(21%)') { // 零气
                map[consignID].dailyCalibration_1 = item.standardGasActual
            } else if (!map[consignID].dailyCalibration_2) { // 标气1
                map[consignID].dailyCalibration_2 = `${item.average}(${item.standardGasActual})`
                map[consignID].driftCalibration_1 = `${item.driftAverage}(${item.standardGasActual})`
            } else { // 标气2
                map[consignID].dailyCalibration_3 = `${item.average}(${item.standardGasActual})`
                map[consignID].driftCalibration_2 = `${item.driftAverage}(${item.standardGasActual})`
            }

            // 通过数值存在判断校准完成
            if (map[consignID].dailyCalibration_1 && map[consignID].dailyCalibration_2 && map[consignID].dailyCalibration_3 && map[consignID].driftCalibration_1 && map[consignID].driftCalibration_2) {
                map[consignID].isCalibration = '是'
            } else {
                map[consignID].isCalibration = '否'
            }
        }

        const data = []
        for (const key in map) {
            data.push(map[key])
        }
        
        ctx.body = { code: 0 , message: '查询仪器校准成功', data }
    } catch (err) {
        logger.log('instrumentCalibrationRecord异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询仪器校准失败' }
    }
}

async function addIcr (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { 
            calibrationDate = '', 
            instrument = '',
            dailyCalibration0 = '',
            dailyCalibration500 = '',
            dailyCalibration10K = '',
            driftCalibration500 = '',
            driftCalibration10K = '',
            isCalibration = '',
            calibrationPeople = '',
        } = ctx.request.body

        const data = { 
            companyNum, 
            calibrationDate: new Date(calibrationDate), 
            instrument, 
            dailyCalibration0,
            dailyCalibration500, 
            dailyCalibration10K, 
            driftCalibration500, 
            driftCalibration10K, 
            isCalibration, 
            calibrationPeople
        }
        Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })

        await icrCollection.insertOne(data)
        
        ctx.body = { code: 0 , message: '新增仪器校准成功' }
    } catch (err) {
        logger.log('addIcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增仪器校准失败' }
    }
}

async function editIcr (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        if (editParams.calibrationDate) editParams.calibrationDate = new Date(editParams.calibrationDate)

        Object.assign(editParams, { editDate: new Date(), editUser: username })
        await icrCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: editParams })
        
        ctx.body = { code: 0 , message: '编辑仪器校准成功' }
    } catch (err) {
        logger.log('editIcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑仪器校准失败' }
    }
}

async function deleteIcr (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await icrCollection.deleteMany({ companyNum, _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '删除仪器校准成功' }
    } catch (err) {
        logger.log('deleteIcr异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除仪器校准失败' }
    }
}

module.exports = {
    instrumentCalibrationRecord,
    addIcr,
    editIcr,
    deleteIcr
}
