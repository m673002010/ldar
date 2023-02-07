const userService = require('../service/userService.js')
const jwt = require('jsonwebtoken')

async function register (ctx, next) {
    const createRes = await userService.createFirstAccount()
    if (createRes) {
        ctx.body = { code: 0 , message: '第一个帐号注册成功' }
        return
    } else {
        const { username = '', password = '' } = ctx.request.body
        if (!username || !password) {
            ctx.body = { code: -1, message: '帐密填写不完整' }
            return 
        }

        const res = await userService.register(ctx, next)
        ctx.body = res
    }
}

async function login (ctx, next) {
    const { username = '', password = '' } = ctx.request.body
    if (!username || !password) {
        ctx.body = { code: -1, message: '帐密填写不完整' }
        return 
    }

    ctx.body = await userService.login(ctx, next)
}

async function getUsers (ctx, next) {
    ctx.body = await userService.getUsers(ctx, next)
}

async function addUser (ctx, next) {
    const { username = '', password = '' } = ctx.request.body
    if (!username || !password) {
        ctx.body = { code: -1, message: '帐密填写不完整' }
        return
    }

    const res = await userService.register(ctx, next)
    ctx.body = res
}

async function updateUser (ctx, next) {
    const { userId = 0, username = '', password = '' } = ctx.request.body
    if (!userId || !username || !password) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    const res = await userService.updateUser(ctx, next)
    ctx.body = res
}

async function deleteUser (ctx, next) {
    const { userId } = ctx.request.body
    if (!userId) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    const res = await userService.deleteUser(ctx, next)
    ctx.body = res
}

async function allocateRole (ctx, next) {
    const { userId, roleId } = ctx.request.body
    if (!+userId || !+roleId) {
        ctx.body = { code: -1, message: '参数缺失' }
        return
    }

    const res = await userService.allocateRole(ctx, next)
    ctx.body = res
}

async function userInfo (ctx, next) {
    ctx.body = await userService.userInfo(ctx)
}

module.exports = {
    register,
    login,
    getUsers,
    addUser,
    updateUser,
    deleteUser,
    allocateRole,
    userInfo
}
