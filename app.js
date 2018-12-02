const DB = require('./modules/db'),
    Koa = require('koa'),
    bodyParser = require('koa-bodyparser'),
    app = new Koa(),
    Config = require('./config'),
    response = require('./middlewares/response'),
    session = require('koa-session'),
    cors = require('koa2-cors');

// 将DB挂在全局
global.DB = DB
// 解决前后端跨域问题
app.use(cors({
    // origin: function (ctx) {
    //     if (ctx.url === '/mall') {
    //         return true;
    //     }
    //     return '*';
    // },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

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