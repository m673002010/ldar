const retestInfoCollection = require('../db/retestInfo')
const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const companyCollection = require('../db/company')
const regulationComponentCollection = require('../db/regulationComponent')
const lodash = require('lodash')

const quarterMap = {
    '第1季度': 'First-Ldar-Quarter',
    '第2季度': 'Second-Ldar-Quarter',
    '第3季度': 'Third-Ldar-Quarter',
    '第4季度': 'Fourth-Ldar-Quarter',
}

async function detectionDataLedger (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { 
            year = '',
            quarter = '', 
            label = '', 
            unreachable = '', 
            isLeak = '', 
            medium = '',
            mediumStatus = '', 
            date = null, 
            device = '',
            area = '',
            equipment = '',
            componentType = '',
            sealPointType = '',
            detectPeople = '',
            currentPage = 1,
            pageSize = 10
        } = ctx.request.body

        const query = { companyNum }
        if (label) query.label = label
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (date && date.length) {
            const startDate = date[0]
            const endDate = date[1]
            query.startDate = { $gte: new Date(startDate) }
            query.endDate = { $lte: new Date(endDate) }
        }
        if (detectPeople) query.detectPeople = detectPeople


        // 检测数据
        let detectData = await detectLedgerCollection.find(query).toArray()

        const labelExpandArr = lodash.map(detectData, 'labelExpand')
        const quarterCodeArr = lodash.map(detectData, 'quarterCode')

        // 组件信息
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()

        // 复测信息
        const retestData = await retestInfoCollection.find({ 
            companyNum, 
            labelExpand: { $in: labelExpandArr }, 
            quarterCode: { $in: quarterCodeArr } 
        }).toArray()

        // 阈值
        const regulationCode = (await companyCollection.findOne({ companyNum })).regulationCode
        const regulationComponentData = await regulationComponentCollection.find({ regulationCode }).toArray()

        // 补充组件、复测信息、阈值到检测信息
        detectData = detectData.map(item => {
            const c = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            const r = lodash.find(retestData, { 'labelExpand': item.labelExpand, 'quarterCode': item.quarterCode })
            Object.assign(item, c, r)

            const rc = lodash.find(regulationComponentData, { 'componentType': item.componentType, 'mediumStatus': item.mediumStatus })
            Object.assign(item, { threshold: rc.threshold })

            item.isLeak = item.detectValue >= item.threshold ? '是' : '否'
            item.leakLevel = '安全'

            return item
        })

        detectData = detectData.map(item => {
            item.detectStartDate = item.startDate
            item.detectEndDate = item.endDate
            item.detectNetWorth = item.detectValue - item.backgroundValue

            return item
        })

        if (year) detectData = lodash.filter(detectData, item => { return item.quarterCode.indexOf(year) !== -1 })
        if (quarter) detectData = lodash.filter(detectData, item => { return item.quarterCode.indexOf(quarterMap[quarter]) !== -1 })
        if (componentType) detectData = lodash.filter(detectData, item => { return item.componentType === componentType })
        if (isLeak) detectData = lodash.filter(detectData, item => { return item.isLeak === isLeak })
        if (medium) detectData = lodash.filter(detectData, item => { return item.medium === medium })
        if (mediumStatus) detectData = lodash.filter(detectData, item => { return item.mediumStatus === mediumStatus })
        if (unreachable) detectData = lodash.filter(detectData, item => { return item.unreachable === unreachable })
        if (sealPointType) detectData = lodash.filter(detectData, item => { return item.sealPointType === sealPointType })

        const total = detectData.length
        detectData = detectData.slice((currentPage-1) * pageSize, currentPage * pageSize)

        ctx.body = { code: 0 , message: '查询检测数据台账成功', data: { detectData, total } }
    } catch (err) {
        logger.log('detectionDataLedger异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询检测数据台账失败' }
    }
}

module.exports = {
    detectionDataLedger
}
