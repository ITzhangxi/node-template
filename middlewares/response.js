const debug = require('debug')
const url = require('url')
module.exports = async (ctx, next) => {
    console.log(url.parse(ctx.url).pathname);
    try {
        if (ctx.url === '/mall/user/login' || url.parse(ctx.url).pathname === '/mall/user/captcha') {
            await next()
        } else if (ctx.session.userInfo && ctx.state.userInfo && ctx.state.userInfo === ctx.session.userInfo) {
            await next()
        } else {
            ctx.state.code = -1
            ctx.state.data = {
                message: '请先登录'
            };
        }

        // 调用下一个middleware
        // 处理响应结果
        // 如果直接写入在 body 中，则不作处理
        // 如果写在 ctx.body 为空，则使用 state 作为响应
        ctx.body = ctx.body ? ctx.body : {
            code: ctx.state.code !== undefined ? ctx.state.code : 0,
            data: ctx.state.data !== undefined ? ctx.state.data : {}
        }

    } catch (e) {
        // catch 住全局的错误信息
        debug('Catch Error: o%', e)
        // 设置状态码为 200 - 服务端错误
        ctx.status = 200;
        // 输出详细的错误信息
        ctx.body = {
            code: -1,
            error: e && e.message ? e.message : e.toString()
        }
    }
}