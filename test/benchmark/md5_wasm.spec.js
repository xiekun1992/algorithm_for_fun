const benchmark = require('benchmark')
const suite = new benchmark.Suite()
const { md5: md5Wasm, init } = require('../../src/wasm/md5')
const { md5: xmd5 } = require('../../src/cryptographics/md5_universe')

const buf = new Uint8Array(1 * 1024 * 1024, Math.random())

init().then(() => {
  suite
    .add('md5 wasm', async () => {
      !!md5Wasm(buf)
    })
    .add('md5 universe', () => {
      !!xmd5(buf)
    })
    .on('cycle', function(event) {
      console.log(String(event.target));
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ async: true })
})
