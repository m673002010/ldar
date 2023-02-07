const rightService = require('../service/rightService.js')

async function rightTree (ctx, next) {
    ctx.body = await rightService.rightTree()
}

async function addRight (ctx, next) {
    const { authType = 0, authName = '', path = '' } = ctx.request.body
    if (!+authType || !authName || !path) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    ctx.body = await rightService.addRight(ctx)
}

async function editRight (ctx, next) {
    const { rightId = 0, authType = 0, authName = '', path = '' } = ctx.request.body
    if (!+rightId || !+authType || !authName || !path) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    ctx.body = await rightService.editRight(ctx)
}

async function deleteRight (ctx, next) {
    const { rightId = 0 } = ctx.request.query
    if (!+rightId) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    ctx.body = await rightService.deleteRight(ctx)
}


module.exports = {
    rightTree,
    addRight,
    editRight,
    deleteRight
}
