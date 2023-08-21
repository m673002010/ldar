const jwt = require('jsonwebtoken')

async function checkLogin(ctx, next) {
    try {
        if ([
            '/api/user/login', 
            '/api/user/logout', 
            // '/api/user/register'
        ].includes(ctx.path)) await next()
        else {
            const token = ctx.get('Authorization') // 获取请求 Header 中 Authorization 值

            if (!token) {
                ctx.body = { code: -1, message: '未登陆' }
                return
            } else {
                userInfo = jwt.verify(token, config.privateKey) // 验证 token
                if (userInfo) {
                    ctx.userInfo = userInfo
                    await next()
                }
                // ctx.body = { code: 0, message: '已登陆', data: { userInfo} }
            }
        }
    } catch (err) {
        console.log('checkLogin异常:', err)
        ctx.body = { code: -1, message: 'checkLogin异常' }
    }
}

module.exports = {
    checkLogin
}
