const detectFileCollection = require('../db/detectFile')
const lodash = require('lodash')
const fs = require('fs')
const path = require('path')
const { ObjectId } = require('mongodb')

async function queryDetectFile (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { year = '', quarter = '', fileName = '' } = ctx.request.query
        const query = { companyNum }
        if (year) query.year = year
        if (quarter) query.quarter = quarter
        if (fileName) query.fileName = fileName

        const detectFileData = await detectFileCollection.find(query).toArray()

        ctx.body = { code: 0 , message: '查询检测文件成功', data: detectFileData }
    } catch (err) {
        logger.log('queryDetectFile异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询检测文件失败' }
    }
}

async function uploadDetectFile (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const file = ctx.request.files.file
        const { year, quarter } = ctx.request.body

        // 如果文件夹不存在，创建它
        const folderPath = path.join(__dirname, `../static/${companyNum}/detectFile`)
        if (!fs.existsSync(folderPath)) {
            // 使用 recursive 选项确保创建多层嵌套目录
            fs.mkdirSync(folderPath, { recursive: true }) 
            logger.log(`文件夹 ${folderPath} 创建成功`)
        } else {
            logger.log(`文件夹 ${folderPath} 已经存在`)
        }

        const reader = fs.createReadStream(file.filepath)
        const upStream = fs.createWriteStream(`${folderPath}/${file.originalFilename}`)
        reader.pipe(upStream)

        const detectFile = await detectFileCollection.findOne({ companyNum, fileName: file.originalFilename })

        if (!detectFile) {
            const data = { 
                companyNum,
                year,
                quarter,
                fileName: file.originalFilename, 
                fileType: file.originalFilename.split('.')[1], 
                filePath: `/${companyNum}/detectFile/${file.originalFilename}` 
            }
            Object.assign(data, { createDate: new Date(), createUser: username })
            await detectFileCollection.insertOne(data)
        }

        ctx.body = { code: 0 , message: '上传检测文件成功' }
    } catch (err) {
        logger.log('uploadDetectFile异常:' + err, "error")
        ctx.body = { code: -1 , message: '上传检测文件失败' }
    }
}

async function deleteDetectFile (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))
        const fileNameArr = lodash.map(deleteData, 'fileName')

        await detectFileCollection.deleteMany({ companyNum, _id: { $in: _idArr } })

        for (const fileName of fileNameArr){
            fs.unlink(`${path.join(__dirname, `../static/${companyNum}/detectFile/${fileName}`)}`, function (error) {
                if(error){
                    logger.log('删除检测文件失败:' + error, "error")
                }else {
                    logger.log('删除检测文件成功')
                }
            })
        }

        ctx.body = { code: 0 , message: '删除检测文件成功' }
    } catch (err) {
        logger.log('deleteDetectFile异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除检测文件失败' }
    }
}

module.exports = {
    queryDetectFile,
    uploadDetectFile,
    deleteDetectFile
}
