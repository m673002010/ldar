const assignmentCollection = require('../db/assignment')
const assignOrderCollection = require('../db/assignOrder')
const detectLedgerCollection = require('../db/detectLedger')
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
            item.detectValue = +item.detectValue
            item.detectBackgroundValue = +item.detectBackgroundValue
            item.detectStartDate = new Date(item.detectStartDate)
            item.detectEndDate = new Date(item.detectEndDate)

            return item
        })

        // 提取上传数据中的检测点，匹配任务单分配点，分配点位和上传检测点位需要相等
        const detectLabelExpandArr = lodash.map(detectData, 'labelExpand')
        const assignOrderData = await assignOrderCollection.findOne({ companyNum, quarterCode, assignNum })
        const assignedArr = assignOrderData.assignedArr
        if (!lodash.isEqual(assignedArr, detectLabelExpandArr)) {
            ctx.body = { code: -1 , message: '上传检测点位和已分配点位不对应' }
            return
        }

        // 检测点对应的组件
        const componentData = await componentCollection.find({ labelExpand: { $in: detectLabelExpandArr } }).toArray()

        // 组件的阈值
        const regulationCode = (await companyCollection.findOne({ companyNum })).regulationCode
        const regulationComponentData = await regulationComponentCollection.find({ regulationCode }).toArray()
        const thresholdData = regulationComponentData.map(item => {
            const obj = { componentType: item.componentType, mediumStatus: item.mediumStatus, threshold: item.threshold }
            return obj
        })

        // 记录泄漏
        const leakFixArr = []
        for (const item of detectData) {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            // 根据组件类型和介质状态获取对应阈值
            const t = lodash.find(thresholdData, { 'componentType': component.componentType, 'mediumStatus': component.mediumStatus })

            // 检测值-背景值，是否大于组件的阈值，判断是否泄漏
            item.isLeak = '否'
            if (t) {
                const detectNetWorth = item.detectValue - item.detectBackgroundValue

                if (detectNetWorth > t.threshold) {
                    leakFixArr.push(item.labelExpand)
                    item.isLeak = '是'
                }
                item.threshold = t.threshold
            }
        }

        // 更新任务单状态为完成
        await assignOrderCollection.updateOne({ companyNum, quarterCode, assignNum }, { 
            $set: {
                detectedArr: detectLabelExpandArr,
                leakFixArr,
                isFinished: '是'
            }
        })

        // 避免重复上传，先删除旧检测台账，再新增检测任务台账
        await detectLedgerCollection.deleteMany({ companyNum, quarterCode, assignNum })
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
