const { v4: uuidv4 } = require('uuid')  

async function requestId (ctx, next) {
    await next()
    if (ctx.body) ctx.body.requestId = (uuidv4()).replace(/-/g, "") // 返回uuid
}

module.exports = {
    requestId
}