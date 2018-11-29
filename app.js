const DB = require('./modules/db'),
    Koa = require('koa'),
    bodyParser = require('koa-bodyparser'),
    app = new Koa(),
    Config = require('./config'),
    response = require('./middlewares/response'),
    session = require('koa-session')

// 将DB挂在全局
global.DB = DB

// 使用响应处理中间件
app.use(response)

// 配置session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 24 * 60 * 60 * 100, // session有效时间为24小时
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: true // 调用接口时候刷新session
};

app.use(session(CONFIG, app));

// 解析请求体
app.use(bodyParser())

// 引入路由分发
const router = require('./routes')

app.use(router.routes())
    .use(router.allowedMethods())
    .listen(Config.port, Config.host, err => {
        if (err) throw new Error(err)
        console.log(`服务已经启动:http://${Config.host}:${Config.port}`);
    })