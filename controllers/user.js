const path = require('path');
const {md5, responseErr} = require(path.join($, 'utils'));
const svgCaptcha = require('svg-captcha');
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
        const {username, password, captcha} = ctx.request.body
        const md5Pwd = md5(password)
        // console.log(captcha === ctx.state.captcha);
        // console.log(ctx.session.captcha);
        // console.log(captcha);
        console.log(username);
        console.log(password);
        console.log(captcha);
        console.log(ctx.session.captcha);
        console.log(captcha.toLowerCase() === ctx.session.captcha.toLowerCase());
        console.log(username && password && captcha.toLowerCase() === ctx.session.captcha.toLowerCase());
        if (username && password && captcha.toLowerCase() === ctx.session.captcha.toLowerCase()) {
            await DB.find('user', {
                username,
                password: md5Pwd
            }).then(res => {
                console.log(res);
                if (res.length) {
                    ctx.state.data = {
                        message: '登录成功'
                    }
                    // 将用户信息存放到userInfo中
                    ctx.session.userInfo = {username, password}
                    // 将用户信息存放到全局变量userInfo中
                    ctx.state.userInfo = {username, password}
                } else {
                    ctx.state.code = -1;
                    ctx.state.data = {
                        message: '用户名或密码不正确'
                    }
                }
            }, err => {
                responseErr(ctx, err, 'user/login')
            })
        }else {
            ctx.state.code = -1;
            ctx.state.data = {
                message: '用户名或密码不正确'
            }
        }
    } catch (err) {
        responseErr(ctx, err, 'user/login')
    }
}

// 给前端返回验证码
exports.captcha = async ctx => {
    const captcha = svgCaptcha.create({
        size: 4, // 验证码个数
        ignoreChars: ['0o1i'], // 忽略生成的字符
        noise: 1, // 噪声线数
        color: true, // 如果设置了背景选项，则字符将具有不同的颜色而不是灰色，true
        background: '#606266',
        height: 40,
        width: 110
    })
    ctx.session.captcha = captcha.text
    ctx.response.type = "image/svg+xml";
    ctx.body = captcha.data // 将验证码图片数据返回给前端
}