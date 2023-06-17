const assignmentCollection = require('../db/assignment')
const assignOrderCollection = require('../db/assignOrder')
const detectLedgerCollection = require('../db/detectLedger')
const leakLedgerCollection = require('../db/leakLedger')
const componentCollection = require('../db/component')
const companyCollection = require('../db/company')
const regulationComponentCollection = require('../db/regulationComponent')
const lodash = require('lodash')

async function uploadDetectTask (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '', assignNum = '' } = ctx.request.body
        let { detectData = [] } = ctx.request.body

        // 上传数据为空直接返回
        if (detectData.length === 0) {
            ctx.body = { code: -1 , message: '没有上传检测数据' }
            return
        }

        // 补充对应的检测周期和任务单号
        detectData = detectData.map(item => {
            item.companyNum = companyNum
            item.quarterCode = quarterCode
            item.assignNum = assignNum
            item.labelExpand = item.label + '-' + item.expand
            item.detectDate = new Date(item.detectDate)
            item.startDate = new Date(item.startDate)
            item.endDate = new Date(item.endDate)

            return item
        })

        // 提取上传数据中的检测点
        const detectLabelExpandArr = lodash.map(detectData, 'labelExpand')

        // 任务单分配点
        const assignOrderData = await assignOrderCollection.findOne({ companyNum, quarterCode, assignNum })
        const assignedArr = assignOrderData.assignedArr

        // 任务单分配点位和上传检测点位需要相等
        if (!lodash.isEqual(assignedArr, detectLabelExpandArr)) {
            ctx.body = { code: -1 , message: '上传检测点位和已分配点位不对应' }
            return
        }

        // 检测点对应的组件
        const componentData = await componentCollection.find({ labelExpand: { $in: detectLabelExpandArr } }).toArray()

        // 组件阈值
        const regulationCode = (await companyCollection.findOne({ companyNum })).regulationCode
        const regulationComponentData = await regulationComponentCollection.find({ regulationCode }).toArray()
        const thresholdData = regulationComponentData.map(item => {
            const obj = { componentType: item.componentType, mediumStatus: item.mediumStatus, threshold: item.threshold }
            return obj
        })

        // 判断是否泄漏，并记录泄漏信息
        const leakFixArr = []
        for (const item of detectData) {
            const c = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            const t = lodash.find(thresholdData, { 'componentType': c.componentType, 'mediumStatus': c.mediumStatus })

            const detectNetWorth = item.detectValue - item.backgroundValue
            if (detectNetWorth > t.threshold) {
                leakFixArr.push(item.labelExpand)
                await leakLedgerCollection.insertOne(item)
            }
        }

        // 更新任务单状态
        await assignOrderCollection.updateOne({ companyNum, quarterCode, assignNum }, { 
            $set: {
                detectedArr: detectLabelExpandArr,
                leakFixArr,
                isFinished: '是'
            }
        })

        // 避免重复上传，先删除旧台账
        await detectLedgerCollection.deleteMany({ companyNum, quarterCode, assignNum })
        // 新增检测任务台账
        await detectLedgerCollection.insertMany(detectData)

        // 更新检测周期
        const assignmentData = await assignmentCollection.findOne({ companyNum, quarterCode })
        assignmentData.detectedArr = lodash.uniq(assignmentData.detectedArr.concat(detectLabelExpandArr))
        assignmentData.leakFixArr = lodash.uniq(assignmentData.leakFixArr.concat(leakFixArr))

        await assignmentCollection.updateOne({ companyNum, quarterCode }, { 
            $set: {
                detectedArr: assignmentData.detectedArr,
                leakFixArr: assignmentData.leakFixArr
            }
        })

        ctx.body = { code: 0 , message: '上传检测任务成功' }
    } catch (err) {
        logger.log('uploadDetectTask异常:' + err, "error")
        ctx.body = { code: -1 , message: '上传检测任务失败' }
    }
}

module.exports = {
    uploadDetectTask
}
