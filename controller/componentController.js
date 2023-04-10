const componentCollection = require('../db/component')
const cirCollection = require('../db/componentImportRecord')
const { ObjectId } = require('mongodb')
const lodash = require('lodash')

async function importComponent (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const { importData = [], importFile = '' } = ctx.request.body

        const fileData = { companyNum, importFile, username, newCount: importData.length, createDate: new Date(), createUser: username }
        await cirCollection.insertOne(fileData)

        const data = importData.map(item => {
            Object.assign(item, { companyNum })
            item.labelExpend = item.label + '-' + item.expand

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

module.exports = {
    importComponent,
    queryComponent,
    queryImportRecord,
    editComponent,
    deleteComponent,
}
