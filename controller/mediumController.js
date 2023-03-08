const mediumCollection = require('../db/medium.js')

async function queryMedium (ctx, next) {
}

async function addMedium (ctx, next) {
    try {
        const { companyNum } = ctx.userInfo
        const { mediumNum = '', medium = '',  } = ctx.request.body
        
        const data = importData.map(item => Object.assign(item, { companyNum }))

        await iDSCollection.insertMany(data)
        
        ctx.body = { code: 0 , message: '新增介质成功' }
    } catch (err) {
        logger.log('addMedium异常:' + err, "error")
        ctx.body = { code: -1 , message: '新增介质失败' }
    }
}

async function editMedium (ctx, next) {
}

async function deleteMedium (ctx, next) {
}

module.exports = {
    queryMedium,
    addMedium,
    editMedium,
    deleteMedium
}
