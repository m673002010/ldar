const pictureLedgerCollection = require('../db/pictureLedger.js')
const lodash = require('lodash')
const fs = require('fs')
const path = require('path')
const { ObjectId } = require('mongodb')

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

        const reader = fs.createReadStream(file.filepath)
        const upStream = fs.createWriteStream(path.join(__dirname, `../static/pictureLedger/${file.originalFilename}`))
        reader.pipe(upStream)

        const pictureRecord = await pictureLedgerCollection.findOne({ companyNum, picture: file.originalFilename })

        if (!pictureRecord) {
            const data = { companyNum, label: file.originalFilename.split('.')[0], picture: file.originalFilename, picturePath: `/pictureLedger/${file.originalFilename}` }
            Object.assign(data, { createDate: new Date(), createUser: username, editDate: new Date(), editUser: username })
            await pictureLedgerCollection.insertOne(data)
        }

        ctx.body = { code: 0 , message: '新增图片成功' }
    } catch (err) {
        logger.log('uploadPicture异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增图片失败' }
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
                }
                logger.log('删除图片成功')
            })
        }
        
        ctx.body = { code: 0 , message: '删除图片成功' }
    } catch (err) {
        logger.log('deletePicture异常:' + err, "error")
        ctx.body = { code: -1 , message: '删除图片失败' }
    }
}

module.exports = {
    queryPicture,
    uploadPicture,
    deletePicture
}
