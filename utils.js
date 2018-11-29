const md5 = require('md5')
exports.md5 = md5
exports.responseErr = (ctx, err, errLoc, code = -1) => {
    ctx.state.code = code
    ctx.state.data = err
    console.log(`${errLoc}.js:${err}`);
}