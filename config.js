const path = require('path')
const os = require('os') // 操作系统
// 获取本地IP
const IP = os.networkInterfaces().en0[1].address
exports.host = IP // node服务的IP
exports.port = 3737 // node服务的端口号
global.$ = __dirname