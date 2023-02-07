const roleService = require('../service/roleService')

async function roleList (ctx, next) {
    ctx.body = await roleService.roleList(ctx, next)
}

async function addRole (ctx, next) {
    const { roleName = '', desc = '' } = ctx.request.body
    if (!roleName || !desc) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    ctx.body = await roleService.addRole(ctx, next)
}

async function editRole (ctx, next) {
    const { roleId = 0, roleName = '', desc = '' } = ctx.request.body
    if (!+roleId || !roleName || !desc) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    ctx.body = await roleService.editRole(ctx, next)
}

async function deleteRole (ctx, next) {
    const { roleId = 0 } = ctx.request.query
    if (!+roleId) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    ctx.body = await roleService.deleteRole(ctx, next)
}

async function allocateRights (ctx, next) {
    const { roleId = 0, rightIds = [] } = ctx.request.body
    if (!+roleId) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    ctx.body = await roleService.allocateRights(ctx, next)
}

async function getRoleRights (ctx, next) {
    const { roleId = 0 } = ctx.request.query
    if (!+roleId) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    ctx.body = await roleService.getRoleRights(ctx, next)
}

module.exports = {
    roleList,
    addRole,
    editRole,
    deleteRole,
    allocateRights,
    getRoleRights
}
