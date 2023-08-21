const path = require('path')
start()

async function start () {
    try {
        // 配置
        global.config = require('./config')

        // 日志
        global.logger = require('./lib/logger') 

        // 连接数据库
        const res = await require('./db').connectDb()
        if (!res) logger.log('server start fail ...:')

        // 中间件
        const Koa = require('koa')
        const router = require('./router.js')
        const { koaBody } = require('koa-body')
        // const bodyParser = require('koa-bodyparser')
        const rq = require('./lib/req')
        const KoaStatic = require('koa-static')
        const KoaMount = require('koa-mount')
        const { checkLogin } = require('./middleware/checkLogin')
        const { checkRight } = require('./middleware/checkRight')
        const { ctxLog } = require('./middleware/log')
        const { requestId } = require('./middleware/requestId')

        const app = new Koa()

        app.use(ctxLog)
        app.use(requestId)

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

        // app.use(KoaStatic(path.join(__dirname, './static')))
        app.use(KoaMount('/api', KoaStatic(path.join(__dirname, './static'))))

        // 校验登录
        app.use(checkLogin)
        // 校验权限
        app.use(checkRight)

        app.use(async (ctx, next) => {
            ctx.rq = rq
            await next()
        })

        // app.use(bodyParser())
        app.use(koaBody({ 
            multipart: true, 
            urlencoded: true,
            formLimit:"10mb",
            jsonLimit:"10mb"
        }))
        app.use(router.routes())

        app.listen(config.port)
        logger.log(`server start success... listen ${config.port}`)
    } catch (err) {
        // 导致进程退出的错误
        logger.log('process exit err:' + err.message, 'error')
        process.exit(1)
    }
}
