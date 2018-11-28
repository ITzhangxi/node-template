const DB = require('./modules/db'),
    Koa = require('koa'),
    bodyParser = require('koa-bodyparser'),
    app = new Koa(),
    Config = require('./config'),
    response = require('./middlewares/response')


// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser)

// 引入路由分发
const router = require('./routes')

app.use(router.routes())
    .use(router.allowedMethods())
    .listen(Config.port, Config.host, err => {
        if (err) throw new Error(err)
        console.log('服务已经启动');
    })