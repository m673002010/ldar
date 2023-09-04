const detectLedgerCollection = require('../db/detectLedger')
const componentCollection = require('../db/component')
const pictureLedgerCollection = require('../db/pictureLedger.js')
const fs = require("fs")
const path = require("path")
const lodash = require('lodash')
const PizZip = require("pizzip")
const Docxtemplater = require("docxtemplater")

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

        // 如果文件夹不存在，创建它
        const folderPath = path.join(__dirname, `../static/${companyNum}/repairOrder`)
        if (!fs.existsSync(folderPath)) {
            // 使用 recursive 选项确保创建多层嵌套目录
            fs.mkdirSync(folderPath, { recursive: true }) 
            logger.log(`文件夹 ${folderPath} 创建成功`)
        } else {
            logger.log(`文件夹 ${folderPath} 已经存在`)
        }

        // Load the docx file as binary content
        const templatePath = path.join(__dirname, `../static/template/repairOrderTemplate.docx`)
        const content = fs.readFileSync(
            templatePath,
            "binary"
        )
        const zip = new PizZip(content)
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        })

        doc.render({
            orders: [
                {
                    index: 1,
                    device: 2,
                    area: 3,
                    equipment: 4,
                    label: 'L-00001',
                    componentType: 5,
                    medium: 6,
                    detectStartDate: 7,
                    planRepairDate: 8,
                    detectPeople: 9,
                    PPM: 11,
                    repairEndDate: 12,
                    repairPeople: 13,
                    retestStartDate: 13,
                    retestPeople: 13,
                    retestInstrument: 14,
                    retestBackgroundValue: 14,
                    'PPM': 11,
                    imageUrl: 'https://www.mmldar.com/api/BLHG/pictureLedger/L-00001.jpg'
                }
            ]
        })

        const buf = doc.getZip().generate({
            type: "nodebuffer",
            // compression: DEFLATE adds a compression step.
            // For a 50MB output document, expect 500ms additional CPU time
            compression: "DEFLATE",
        })

        // buf is a nodejs Buffer, you can either write it to a
        // file or res.send it with express for example.
        fs.writeFileSync(`${folderPath}/维修工单.docx`, buf)

        wordPath = `/${companyNum}/repairOrder/维修工单.docx`

        ctx.body = { code: 0 , message: '新增图片成功', data: wordPath }
    } catch (err) {
        logger.log('exportWord异常:' + err, "error")
        ctx.body = { code: -1 , message: '导出维修工单失败' }
    }
}

async function exportWord11 (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo

        // 如果文件夹不存在，创建它
        const folderPath = path.join(__dirname, `../static/${companyNum}/repairOrder`)
        if (!fs.existsSync(folderPath)) {
            // 使用 recursive 选项确保创建多层嵌套目录
            fs.mkdirSync(folderPath, { recursive: true }) 
            logger.log(`文件夹 ${folderPath} 创建成功`)
        } else {
            logger.log(`文件夹 ${folderPath} 已经存在`)
        }

        // Load the docx file as binary content
        const templatePath = path.join(__dirname, `../static/template/repairOrderTemplate.docx`)
        const content = fs.readFileSync(
            templatePath,
            "binary"
        )
        const doc = new Docxtemplater(content)

        // Prepare the data for the vertically-oriented table
        const orders = [
            {
                index: 1,
                device: 2,
                area: 3,
                equipment: 4,
                label: 'L-00001',
                componentType: 5,
                medium: 6,
                detectStartDate: 7,
                planRepairDate: 8,
                detectPeople: 9,
                PPM: 11,
                repairEndDate: 12,
                repairPeople: 13,
                retestStartDate: 13,
                retestPeople: 13,
                retestInstrument: 14,
                retestBackgroundValue: 14,
                PPM: 11,
                imageUrl: 'https://www.mmldar.com/api/BLHG/pictureLedger/L-00001.jpg'
            }
        ]

        // Set the data for the table
        doc.setData({ orders })

        // Add a function to handle the replacement of the vertically-oriented table
        // doc.substituteVerticalTable = function(tableNode, data) {
        // // Remove the placeholder row from the template
        //     tableNode.removeChild(1)

        //     // Insert a new row for each data entry
        //     data.forEach(entry => {
        //         const newRow = tableNode.firstElementChild.cloneNode(true)
        //         newRow.firstElementChild.textContent = entry.name
        //         newRow.lastElementChild.textContent = entry.age
        //         tableNode.appendChild(newRow)
        //     })
        // }

        // Process the document
        doc.render()

        // Convert the rendered document content to binary
        const generatedDocContent = doc.getZip().generate({ type: 'nodebuffer' })

        // Save the generated document to a file
        fs.writeFileSync(`/${companyNum}/repairOrder/维修工单.docx`, generatedDocContent)
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
