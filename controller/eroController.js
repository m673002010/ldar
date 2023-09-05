const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const pictureLedgerCollection = require('../db/pictureLedger.js')
const fs = require("fs")
const path = require("path")
const lodash = require('lodash')
const PizZip = require("pizzip")
const Docxtemplater = require("docxtemplater")
const ImageModule = require('docxtemplater-image-module-free')

async function queryRepairInfo (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { device = '', area = '', equipment = '', componentType = '', isLeak = '', isDelayRepair = '', date } = ctx.request.body

        const query = { companyNum }
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment
        if (isLeak) query.isLeak = isLeak
        if (isDelayRepair) query.isDelayRepair = isDelayRepair
        if (date && date.length) {
            query.retestStartDate = { $gte: new Date(date[0]) }
            query.retestEndDate = { $lte: new Date(date[1]) }
        }

        let repairInfoData = await detectLedgerCollection.find(query).toArray()

        // 补充图片信息
        const pictures = await pictureLedgerCollection.find({ companyNum }).toArray()

        // 补充组件信息
        const labelExpandArr = lodash.map(repairInfoData, 'labelExpand')
        const componentData = await componentCollection.find({ companyNum, labelExpand: { $in: labelExpandArr } }).toArray()
        repairInfoData = repairInfoData.map(item => {
            const component = lodash.find(componentData, { 'labelExpand': item.labelExpand })
            Object.assign(item, component)

            const pic = lodash.find(pictures, { 'label': item.label })
            Object.assign(item, { picturePath: pic.picturePath})

            item.detectNetWorth = item.detectValue - item.detectBackgroundValue
            return item
        })

        if (componentType) repairInfoData = lodash.filter(repairInfoData, item => { return item.componentType === componentType })

        ctx.body = { code: 0 , message: '查询复测信息成功', data: repairInfoData }
    } catch (err) {
        logger.log('queryRepairInfo异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询复测信息失败' }
    }
}

async function exportRetestTask (ctx, next) {
    try {
        return this.queryRepairInfo(ctx, next)
    } catch (err) {
        logger.log('exportRetestTask异常:' + err, "error")
        ctx.body = { code: -1 , message: '导出复测任务失败' }
    }
}

async function exportWord (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo

        const { repairInfo = null } = ctx.request.body
        repairInfo.location = `${repairInfo.equipment} ${repairInfo.location} ${repairInfo.distance}米 ${repairInfo.floor}楼 ${repairInfo.high}米`

        // 如果文件夹不存在，创建它
        const folderPath = path.join(__dirname, `../static/${companyNum}/repairOrder`)
        if (!fs.existsSync(folderPath)) {
            // 使用 recursive 选项确保创建多层嵌套目录
            fs.mkdirSync(folderPath, { recursive: true }) 
            logger.log(`文件夹 ${folderPath} 创建成功`)
        } else {
            logger.log(`文件夹 ${folderPath} 已经存在`)
        }
        const outPath = `${folderPath}/维修工单.docx`

        // Load the docx file as binary content
        const templatePath = path.join(__dirname, `../static/template/repairOrderTemplate.docx`)
        const content = fs.readFileSync(
            templatePath,
            "binary"
        )
        const zip = new PizZip(content)
 
        const opts = {
            centered: true,
            filetType: "docx"
        }
        opts.getImage = function(tagValue, tagName) {
            return fs.readFileSync(tagValue)
        }
        opts.getSize = function(img, tagValue, tagName) {
            return [350, 350]
        }
        const imageModule = new ImageModule(opts)

        var docx = new Docxtemplater()
        .attachModule(imageModule)
        .loadZip(zip)
        .setData(Object.assign(repairInfo, { image: path.join(__dirname, `../static${repairInfo.picturePath}`) }))
        .render()

        const buffer = docx.getZip().generate({ type: "nodebuffer" })
        fs.writeFileSync(outPath, buffer)

        ctx.body = { code: 0 , message: '导出维修工单成功', data: `/${companyNum}/repairOrder/维修工单.docx` }
    } catch (err) {
        logger.log('exportWord异常:' + err, "error")
        ctx.body = { code: -1 , message: '导出维修工单失败' }
    }
}

module.exports = {
    queryRepairInfo,
    exportRetestTask,
    exportWord
}
