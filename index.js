const { md5 } = require('./src/wasm/md5')
// const { md5 } = require('./src/cryptographics/md5_universe')
const {performance} = require('perf_hooks')
const st = performance.now()

const output = md5(Buffer.alloc(1024 * 1024 * 1024, 0))

console.log(performance.now() - st)
console.log(output)
