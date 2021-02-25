// const { md5 } = require('./src/md5')
// const output = md5(Buffer.alloc(1024 * 1024, '1'))
// console.log(output)

const { md5 } = require('./src/md5_universe')
const fs = require('fs')
console.log(md5(fs.readFileSync('e:/迅雷下载/RTP-075.mp4')))