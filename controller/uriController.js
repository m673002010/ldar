const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const pictureLedgerCollection = require('../db/pictureLedger.js')
const { ObjectId } = require('mongodb')
const lodash = require('lodash')

const quarterMap = {
    '第1季度': 'First-Ldar-Quarter',
    '第2季度': 'Second-Ldar-Quarter',
    '第3季度': 'Third-Ldar-Quarter',
    '第4季度': 'Fourth-Ldar-Quarter',
}

async function queryRetestInfo (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { device = '', area = '', equipment = '', componentType = '', isLeak = '', isDelayRepair = '', year = '', quarter = ''  } = ctx.request.query

        const query = { companyNum }
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (isLeak) query.isLeak = isLeak
        if (isDelayRepair) query.isDelayRepair = isDelayRepair

        // 复测信息
        let retestInfoData = await detectLedgerCollection.find(query).toArray()

        // 补充图片信息
        const pictures = await pictureLedgerCollection.find({ companyNum }).toArray()

        // 补充组件信息
        const labelExpandArr = lodash.uniq(lodash.map(retestInfoData, 'labelExpand'))
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        retestInfoData = retestInfoData.map(item => {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            if (component) delete component._id
            Object.assign(item, component)

            const pic = lodash.find(pictures, { 'label': item.label })
            if (pic) Object.assign(item, { picturePath: pic.picturePath})

            // 检测净值
            item.detectNetWorth = item.detectValue - item.detectBackgroundValue

            return item
        })

        if (componentType) retestInfoData = lodash.filter(retestInfoData, item => { return item.componentType === componentType })
        if (year) retestInfoData = lodash.filter(retestInfoData, item => { return item.quarterCode.indexOf(year) !== -1 })
        if (quarter) {
            const quarterCode = quarterMap[quarter]
            retestInfoData = lodash.filter(retestInfoData, item => { return item.quarterCode.indexOf(quarterCode) !== -1 })
        }

        ctx.body = { code: 0 , message: '查询复测信息成功', data: retestInfoData }
    } catch (err) {
        logger.log('queryRetestInfo异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询复测信息失败' }
    }
}

async function importRetestInfo (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '', importData = [] } = ctx.request.body

        for (const item of importData) {
            const labelExpand = item.label + '-' + item.expand

            await detectLedgerCollection.updateOne({ companyNum, quarterCode, labelExpand }, {
                $set: {
                    repairPeople: item.repairPeople,
                    repairCount: +item.repairCount,
                    repairEndDate: new Date(item.repairEndDate),
                    repairUseTime: item.repairUseTime,
                    repairMeasure: item.repairMeasure,
                    retestStartDate: new Date(item.retestStartDate),
                    retestEndDate: new Date(item.retestEndDate),
                    retestInstrument: item.retestInstrument,
                    afterLeakRate: item.afterLeakRate,
                    retestPeople: item.retestPeople,
                    retestValue: +item.retestValue,
                    retestBackgroundValue: +item.retestBackgroundValue,
                    isDelayRepair: item.isDelayRepair,
                    delayRepairReason: item.delayRepairReason,
                    planRepairDate: new Date(item.planRepairDate),
                }
            })
        }
        ctx.body = { code: 0 , message: '导入复测信息成功' }
    } catch (err) {
        logger.log('importRetestInfo异常:' + err, "error")
        ctx.body = { code: -1 , message: '导入复测信息失败' }
    }
}

async function delayRepair (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { _id = '', isDelayRepair = '', delayRepairReason = '' } = ctx.request.body

        await detectLedgerCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: { isDelayRepair, delayRepairReason } })

        ctx.body = { code: 0 , message: '延迟修改成功' }
    } catch (err) {
        logger.log('delayRepair异常:' + err, "error")
        ctx.body = { code: -1 , message: '延迟修改失败' }
    }
}

module.exports = {
    queryRetestInfo,
    importRetestInfo,
    delayRepair
}
