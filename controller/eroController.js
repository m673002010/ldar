const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const pictureLedgerCollection = require('../db/pictureLedger.js')
const fs = require("fs")
const path = require("path")
const lodash = require('lodash')
const PizZip = require("pizzip")
const Docxtemplater = require("docxtemplater")
const ImageModule = require('docxtemplater-image-module-free')
const DocxMerger = require('docx-merger')

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
            if (component) delete component._id
            Object.assign(item, component)

            const pic = lodash.find(pictures, { 'label': item.label })
            if (pic) Object.assign(item, { picturePath: pic.picturePath})

            item.detectNetWorth = item.detectValue - item.detectBackgroundValue
            return item
        })

        if (componentType) repairInfoData = lodash.filter(repairInfoData, item => { return item.componentType === componentType })

        // 复测值-复测背景值 > 阈值，则继续返回数据
        repairInfoData = lodash.filter(repairInfoData, item => { return item.retestValue - item.retestBackgroundValue > item.threshold })

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
        const { repairInfoArr = [] } = ctx.request.body

        // 如果文件夹不存在，创建它
        const folderPath = path.join(__dirname, `../static/${companyNum}/repairOrder`)
        if (!fs.existsSync(folderPath)) {
            // 使用 recursive 选项确保创建多层嵌套目录
            fs.mkdirSync(folderPath, { recursive: true }) 
            logger.log(`文件夹 ${folderPath} 创建成功`)
        } else {
            logger.log(`文件夹 ${folderPath} 已经存在`)
        }

        // 生成docx
        const mergeArr = []
        for (const item of repairInfoArr) {
            item.location = `${item.equipment} ${item.location} ${item.distance}米 ${item.floor}楼 ${item.high}米`

            // 加载模板
            const templatePath = path.join(__dirname, `../static/template/repairOrderTemplate.docx`)
            const content = fs.readFileSync(
                templatePath,
                "binary"
            )
            const zip = new PizZip(content)

            // 逐个记录生成文件
            const outPath = `${folderPath}/维修工单${item._id}.docx`
            mergeArr.push(outPath)

            // 图片设置
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

            const docx = new Docxtemplater()
            .attachModule(imageModule)
            .loadZip(zip)
            .setData(Object.assign(item, { image: path.join(__dirname, `../static${item.picturePath}`) }))
            .render()

            const buffer = docx.getZip().generate({ type: "nodebuffer" })
            fs.writeFileSync(outPath, buffer)
        }

        // 合并
        const fileArr = []
        for (const item of mergeArr) {
            const file = fs.readFileSync(item, 'binary')
            fileArr.push(file)
        }
        const merger = new DocxMerger({}, fileArr)

        merger.save('nodebuffer',function (data) {
            fs.writeFileSync(`${folderPath}/维修工单.docx`, data, function(err){})
        })

        for (const file of mergeArr){
            fs.unlink(file, function (error) {
                if(error){
                    logger.log('删除维修子工单失败:' + error, "error")
                }else {
                    logger.log('删除维修子工单成功')
                }
            })
        }

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
