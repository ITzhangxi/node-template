const router = require('koa-router')({
    prefix: '/mall'  // 每个接口添加一个前缀
})

const controllers = require('../controllers')

// 新增用户
router.post('/user/add', controllers.user.add)
// 登录
router.post('/user/login', controllers.user.login)
// 给前端返回验证码
router.get('/user/captcha', controllers.user.captcha)


module.exports = router