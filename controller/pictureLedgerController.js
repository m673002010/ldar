const pictureLedgerCollection = require('../db/pictureLedger.js')
const lodash = require('lodash')
const fs = require('fs')
const path = require('path')
const { ObjectId } = require('mongodb')
const compressing = require('compressing')

async function queryPicture (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { picture = '' } = ctx.request.query
        const query = {}
        if (companyNum) query.companyNum = companyNum
        if (picture) query.picture = picture

        const data = await pictureLedgerCollection.find(query).toArray()
        
        ctx.body = { code: 0 , message: '查询图片成功', data }
    } catch (err) {
        logger.log('queryPicture异常:' + err, "error")
        ctx.body = { code: -1 , message: '查询图片失败' }
    }
}

async function uploadPicture (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const file = ctx.request.files.file

        // 如果文件夹不存在，创建它
        const folderPath = path.join(__dirname, `../static/${companyNum}/pictureLedger`)
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

        const pictureRecord = await pictureLedgerCollection.findOne({ companyNum, picture: file.originalFilename })

        if (!pictureRecord) {
            const data = { companyNum, label: file.originalFilename.split('.')[0], picture: file.originalFilename, picturePath: `/${companyNum}/pictureLedger/${file.originalFilename}` }
            Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })
            await pictureLedgerCollection.insertOne(data)
        }

        ctx.body = { code: 0 , message: '新增图片成功' }
    } catch (err) {
        logger.log('uploadPicture异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增图片失败' }
    }
}

async function updatePicture (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const file = ctx.request.files.file
        const { _id } = ctx.request.body

        const pictureRecord = await pictureLedgerCollection.findOne({ companyNum, _id: ObjectId(_id) })

        if (pictureRecord) {
            const oldPicturePath = path.join(__dirname, `../static${pictureRecord.picturePath}`)
            const folderPath = oldPicturePath.split('/').slice(0, oldPicturePath.split('/').length - 1).join('/')
            fs.unlink(oldPicturePath, function (error) {
                if(error){
                    logger.log('删除旧图片失败:' + error, "error")
                }else {
                    logger.log('删除旧图片成功')
                }
            })

            const reader = fs.createReadStream(file.filepath)
            const upStream = fs.createWriteStream(`${folderPath}/${file.originalFilename}`)
            reader.pipe(upStream)

            const newPicturePath = '/' + companyNum + `${folderPath}/${file.originalFilename}`.split(`${companyNum}`)[1]

            await pictureLedgerCollection.updateOne({ companyNum, _id: ObjectId(_id) }, { $set: { 
                label: file.originalFilename.split('.')[0], 
                picture: file.originalFilename, 
                picturePath: newPicturePath,
                editDate: new Date(), 
                editUser: username
            }})

            ctx.body = { code: 0 , message: '修改图片成功' }
        } else {
            ctx.body = { code: 0 , message: '修改图片失败' }
        }
    } catch (err) {
        logger.log('updatePicture异常:' + err, "error")
        ctx.body = { code: -1 , message: '修改图片失败' }
    }
}

async function deletePicture (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { deleteData } = ctx.request.body
        const _idArr = lodash.map(deleteData, '_id').map(_id => ObjectId(_id))
        const picturePathArr = lodash.map(deleteData, 'picturePath')

        await pictureLedgerCollection.deleteMany({ companyNum, _id: { $in: _idArr } })

        for (const picturePath of picturePathArr){
            fs.unlink(`${path.join(__dirname, `../static${picturePath}`)}`, function (error) {
                if(error){
                    logger.log('删除图片失败:' + error, "error")
                }else {
                    logger.log('删除图片成功')
                }
            })
        }
        
        ctx.body = { code: 0 , message: '删除图片成功' }
    } catch (err) {
        logger.log('deletePicture异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除图片失败' }
    }
}

async function uploadPictureUni (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const file = ctx.request.files.file
        const { imgName } = ctx.request.body

        // 如果文件夹不存在，创建它
        const folderPath = path.join(__dirname, `../static/${companyNum}/pictureLedger`)
        if (!fs.existsSync(folderPath)) {
            // 使用 recursive 选项确保创建多层嵌套目录
            fs.mkdirSync(folderPath, { recursive: true }) 
            logger.log(`文件夹 ${folderPath} 创建成功`)
        } else {
            logger.log(`文件夹 ${folderPath} 已经存在`)
        }

        const suffix = file.originalFilename.split('.')[1]
        let fileName = ''
        if (imgName) {
            fileName = imgName + '.' + suffix
        } else {
            fileName = file.originalFilename
        }

        const reader = fs.createReadStream(file.filepath)
        const upStream = fs.createWriteStream(`${folderPath}/${fileName}`)
        reader.pipe(upStream)

        const pictureRecord = await pictureLedgerCollection.findOne({ companyNum, picture: fileName })

        if (!pictureRecord) {
            const data = { companyNum, label: fileName.split('.')[0], picture: fileName, picturePath: `/${companyNum}/pictureLedger/${fileName}` }
            Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })
            await pictureLedgerCollection.insertOne(data)
        }

        ctx.body = { code: 0 , message: '新增图片成功' }
    } catch (err) {
        logger.log('uploadPictureUni异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增图片失败' }
    }
}

async function uploadPicArchive (ctx, next) {
    try {
        const { companyNum, username } = ctx.userInfo
        const file = ctx.request.files.file

        // 如果文件夹不存在，创建它
        const pictureLedgerPath = path.join(__dirname, `../static/${companyNum}/pictureLedger`)
        if (!fs.existsSync(pictureLedgerPath)) {
            // 使用 recursive 选项确保创建多层嵌套目录
            fs.mkdirSync(pictureLedgerPath, { recursive: true }) 
            logger.log(`文件夹 ${pictureLedgerPath} 创建成功`)
          } else {
            logger.log(`文件夹 ${pictureLedgerPath} 已经存在`)
        }

        // 压缩包路径
        zipFilePath = `${pictureLedgerPath}/${file.originalFilename}`
        // 后缀
        const suffix = file.originalFilename.split('.')[1]
        // 解压文件夹路径
        unzipFolderPath = `${pictureLedgerPath}/${file.originalFilename.split('.')[0]}`

        // 根据压缩格式，解压压缩包
        const content = fs.readFileSync(file.filepath)
        fs.writeFileSync(zipFilePath, content)
        await compressing[suffix].uncompress(zipFilePath, pictureLedgerPath, {
            zipFileNameEncoding: 'GBK'
        })

        // 将解压文件夹的文件移至上一级目录
        const pictureInfoArr = []
        const pictures = fs.readdirSync(unzipFolderPath)
        for (const pic of pictures) {
            fs.rename(`${unzipFolderPath}/${pic}`, `${pictureLedgerPath}/${pic}`, (err) => {
                if (err) {
                    logger.log('移动文件时出错', err)
                } else {
                    logger.log('文件移动成功')
                }
            })

            const obj = {}
            obj.picturePath = '/' + companyNum + `${pictureLedgerPath}/${pic}`.split(companyNum)[1]
            obj.picture = pic
            obj.label = pic.split('.')[0]

            pictureInfoArr.push(obj)
        }

        // 删除压缩包
        fs.unlink(zipFilePath,(err) => {
            if (err) {
                logger.log(`删除压缩包${zipFilePath}失败`)
            } else {
                logger.log(`删除压缩包${zipFilePath}成功`)
            }
        })

        // 删除解压文件夹
        fs.rmdir(unzipFolderPath,(err) => {
            if (err) {
                logger.log(`删除解压文件夹${unzipFolderPath}失败`)
            } else {
                logger.log(`删除解压文件夹${unzipFolderPath}成功`)
            }
        })

        // 更新图片信息至数据库
        for (const pic of pictureInfoArr) {
            const pictureRecord = await pictureLedgerCollection.findOne({ companyNum, picture: pic.picture })

            if (!pictureRecord) {
                const data = { companyNum, label: pic.label, picture: pic.picture, picturePath: pic.picturePath }
                Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })
                await pictureLedgerCollection.insertOne(data)
            }
        }

        ctx.body = { code: 0 , message: '上传图片压缩包成功' }
    } catch (err) {
        logger.log('uploadPicArchive异常:' + err, "error")
        ctx.body = { code: -1 , message: '上传图片压缩包失败' }
    }
}

function getAllFilePaths(dirPath, fileArray) {
    const files = fs.readdirSync(dirPath)
  
    fileArray = fileArray || []
  
    files.forEach(file => {
        const filePath = path.join(dirPath, file)
        const stats = fs.statSync(filePath)
  
        if (stats.isFile()) {
            fileArray.push(filePath)
        } else if (stats.isDirectory()) {
            getAllFilePaths(filePath, fileArray)
        }
    })
  
    return fileArray
}

module.exports = {
    queryPicture,
    uploadPicture,
    updatePicture,
    deletePicture,
    uploadPictureUni,
    uploadPicArchive
}
