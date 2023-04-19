const assignmentCollection = require('../db/assignment')
const assignOrderCollection = require('../db/assignOrder')
const detectLedgerCollection = require('../db/detectLedger')
const lodash = require('lodash')

async function uploadFile (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { quarterCode = '', assignNum = '', detectFile = '' } = ctx.request.body
        let { detectData = [] } = ctx.request.body

        // 上传数据为空直接返回
        if (detectData.length === 0) {
            ctx.body = { code: -1 , message: '没有上传检测数据' }
            return
        }

        // 补充对应的检测周期和任务单号
        detectData = detectData.map(item => {
            item.quarterCode = quarterCode
            item.assignNum = assignNum

            return item
        })

        // 提取上传数据中的检测点
        const detectLabelExpandArr = detectData.map(item => {
            return item.label + '-' + item.expand
        })

        // 任务单分配点
        const assignOrderData = await assignOrderCollection.findOne({ companyNum, quarterCode, assignNum })
        const assignedArr = assignOrderData.assignedArr

        // 任务单分配点位和上传检测点位需要相等
        if (!lodash.isEqual(assignedArr, detectLabelExpandArr)) {
            ctx.body = { code: -1 , message: '上传检测点位和已分配点位不对应' }
            return
        }

        // 泄漏点计算
        // todo
        const leakFixArr = []

        // 更新任务单状态
        await assignOrderCollection.updateOne({ companyNum, quarterCode, assignNum }, { 
            $set: {
                detectedArr: detectLabelExpandArr,
                leakFixArr,
                isFinished: '是'
            }
        })

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
        logger.log('uploadFile异常:' + err, "error")
        ctx.body = { code: -1 , message: '上传检测任务失败' }
    }
}

module.exports = {
    uploadFile
}
