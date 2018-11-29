const path = require('path')
const {md5, responseErr} = require(path.join($, 'utils'))
// 新增用户
exports.add = async ctx => {
    try {
        const {username, password, tel_no} = ctx.request.body
        const md5Pwd = md5(password)
        await DB.insert('user', {
            username,
            tel_no,
            password: md5Pwd
        }).then(res => {
            const {result} = res
            if (result.ok === 1) {
                console.log(typeof result.ok);
                ctx.state.data = {
                    message: '新增成功'
                }
            }
        }, err => {
            responseErr(ctx, err, 'user/add')
        })
    } catch (err) {
        responseErr(ctx, err, 'user/add')
    }
}

// 登录
exports.login = async ctx => {
    try {
        const {username, password} = ctx.request.body
        ctx.state.data = {username, password}
        const md5Pwd = md5(password)
        if (username && password) {
            await DB.find('user', {
                username,
                password: md5Pwd
            }).then(res => {
                if (res.length) {
                    ctx.state.data = {
                        message: '登录成功'
                    }
                } else {
                    ctx.state.code = -1;
                    ctx.state.data = {
                        message: '用户名或密码不正确'
                    }
                    // 将用户信息存放到userInfo中
                    ctx.session.userInfo = {username, password}
                    // 将用户信息存放到全局变量userInfo中
                    ctx.state.userInfo = {username, password}
                }
            }, err => {
                responseErr(ctx, err, 'user/login')
            })
        }
    } catch (err) {
        responseErr(ctx, err, 'user/login')
    }
}
