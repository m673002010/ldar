const componentCollection = require('../db/component')
const componentTypeCollection = require('../db/componentType')
const cirCollection = require('../db/componentImportRecord')
const { ObjectId } = require('mongodb')
const fs = require('fs')
const path = require('path')
const lodash = require('lodash')
// const xlsx = require('node-xlsx')
const ExcelJs = require('exceljs')

async function importComponent (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { importData = [], importFile = '' } = ctx.request.body

        const fileData = { companyNum, importFile, username, newCount: importData.length, createDate: new Date(), createUser: username }
        await cirCollection.insertOne(fileData)

        // 组件表补充密封点类型字段
        const sealPointTypeMap = {}
        const componentTypeArr = await componentTypeCollection.find().toArray()
        for (const c of componentTypeArr) {
            sealPointTypeMap[c.componentType] = c.sealPointType
        }

        const data = importData.map(item => {
            Object.assign(item, { companyNum })
            item.labelExpand = item.label + '-' + item.expand
            item.sealPointType = sealPointTypeMap[item.componentType]

            return item
        })
        await componentCollection.insertMany(data)

        ctx.body = { code: 0 , message: '导入组件成功' }
    } catch (err) {
        logger.log('importComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '导入组件失败' }
    }
}

async function queryComponent (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { device = '', area = '', equipment = '', currentPage = 1, pageSize = 10 } = ctx.request.query

        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (device) query.device = device
        if (area) query.area = area
        if (equipment) query.equipment = equipment

        const componentData = await componentCollection.find(query).limit(+pageSize).skip((+currentPage - 1) * pageSize).toArray()
        const total = await componentCollection.find(query).count()
        
        ctx.body = { code: 0 , message: '查询组件成功', data: { componentData, total } }
    } catch (err) {
        logger.log('queryComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件失败' }
    }
}

async function queryImportRecord (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const data = await cirCollection.find({ companyNum }).toArray()
        
        ctx.body = { code: 0 , message: '查询组件导入记录成功', data }
    } catch (err) {
        logger.log('queryComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询组件导入记录失败' }
    }
}

async function editComponent (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { editParams } = ctx.request.body
        const { _id } = editParams
        delete editParams._id

        await componentCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: editParams })

        ctx.body = { code: 0 , message: '编辑组件成功' }
    } catch (err) {
        logger.log('editComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '编辑组件失败' }
    }
}

async function deleteComponent (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))

        await componentCollection.deleteMany({ companyNum, _id: { $in: _idArr } })
        
        ctx.body = { code: 0 , message: '清除组件成功' }
    } catch (err) {
        logger.log('deleteComponent异常:' + err, "error")
        ctx.body = { code: -1 , message: '清除组件失败' }
    }
}

async function importComponentUni (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const file = ctx.request.files.file
        const content = fs.readFileSync(file.filepath)
        // const excelPath = path.join(__dirname, `../static/excel/${file.originalFilename}`)
        // fs.writeFileSync(excelPath, content)
        const buffer = Buffer.from(content)

        const tableProps = {
            '装置编号': 'deviceNum',
            '装置名称': 'device',
            '区域编号': 'areaNum',
            '区域名称': 'area',
            '设备编号': 'equipmentNum',
            '设备名称': 'equipment',
            '标签号': 'label',
            '扩展号': 'expand',
            'PID图号': 'pid',
            '参考物': 'reference',
            '位置': 'location',
            '距离(米)': 'distance',
            '楼层': 'floor',
            '高度(米)': 'high',
            '附加描述': 'description',
            '组件类型': 'componentType',
            '介质状态': 'mediumStatus',
            '是否不可达': 'unreachable',
            '不可达原因': 'reason',
            '尺寸(mm)': 'size',
            '是否保温': 'ifWarm',
            '主要介质': 'medium',
            'FLAG号': 'FLAGNum',
            'FLAG名称': 'FLAG',
            '条形码': 'barCode',
            '数量': 'quantity',
            '原始图片': 'picture',
            '标点图片': 'markPicture',
            '标点位置': 'markPosition',
            '时间戳': 'timestamp'
        }

        const excelData = await readExcel(buffer)
        const importData = []
        for (const item of excelData) {
            const obj = {}
            for (let key in item) {
                obj[tableProps[key]] = item[key]
            }
            importData.push(obj)
        }

        const fileData = { companyNum, importFile: file.originalFilename, username, newCount: importData.length, createDate: new Date(), createUser: username }
        await cirCollection.insertOne(fileData)

        // 组件表补充密封点类型字段
        const sealPointTypeMap = {}
        const componentTypeArr = await componentTypeCollection.find().toArray()
        for (const c of componentTypeArr) {
            sealPointTypeMap[c.componentType] = c.sealPointType
        }

        const data = importData.map(item => {
            Object.assign(item, { companyNum })
            item.labelExpand = item.label + '-' + item.expand
            item.sealPointType = sealPointTypeMap[item.componentType]

            return item
        })
        await componentCollection.insertMany(data)

        ctx.body = { code: 0 , message: '导入组件台账成功' }
    } catch (err) {
        logger.log('importComponentUni异常:' + err, "error")
        ctx.body = { code: -1 , message: '导入组件台账失败' }
    }
}

async function readExcel(buffer) {
    const workbook = new ExcelJs.Workbook()
    await workbook.xlsx.load(buffer)
    const worksheet = workbook.worksheets[0]

    let excelTitles = []
    let excelData = []

    worksheet.eachRow((row, rowNumber) => {
        // rowNumber 0 is empty
        if (rowNumber > 0) {
            // get values from row
            let rowValues = row.values
            // remove first element (extra without reason)
            rowValues.shift()
            // titles row
            if (rowNumber === 1) excelTitles = rowValues
            // table data
            else {
                // create object with the titles and the row values (if any)
                let rowObject = {}
                for (let i = 0; i < excelTitles.length; i++) {
                    let title = excelTitles[i]
                    let value = rowValues[i] ? rowValues[i] : ''
                    rowObject[title] = value
                }
                excelData.push(rowObject)
            }
        }
    })
    return excelData
}

module.exports = {
    importComponent,
    queryComponent,
    queryImportRecord,
    editComponent,
    deleteComponent,
    importComponentUni
}
