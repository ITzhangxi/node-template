const router = require('koa-router')({
    prefix: '/mall'  // 每个接口添加一个前缀
})

const controllers = require('../controllers')

router.post('/user/add', controllers.user.add)


module.exports = router