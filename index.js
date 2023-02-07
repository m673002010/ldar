global.config = require('./config')
start()

async function start () {
    // 连接数据库
    const res = await require('./db').connectDb()
    if (!res) console.log('server start fail ...')

    // 中间件
    const Koa = require('koa')
    const router = require('./router.js')
    const bodyParser = require('koa-bodyparser')
    const rq = require('./lib/req')
    const { checkLogin } = require('./middleware/checkLogin')
    const { checkRight } = require('./middleware/checkRight')

    const app = new Koa()

    // 解决跨域
    app.use(async (ctx, next)=> {
        ctx.set('Access-Control-Allow-Origin', '*')
        ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
        ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
        // ctx.set('Access-Control-Allow-Credentials', 'true')
        // 预请求直接响应
        if(ctx.request.method === 'OPTIONS'){
            ctx.body = 200
            return
        }
        await next()
    })

    // 校验登录
    app.use(checkLogin)
    app.use(checkRight)

    app.use(async (ctx, next) => {
        ctx.rq = rq
        await next()
    })

    app.use(bodyParser())
    app.use(router.routes())

    app.listen(config.port)
    console.log(`server start success... listen ${config.port}`)
}
