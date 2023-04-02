const factory = require('./md5_wrapper')
let instance = null

async function init() {
  instance = await factory()
}
function destroy() {
  instance = null
}
function md5(input) {
  if (instance) {
    const outLen = 16
    const arrayLength = input.length
    const bytesPerElement = instance.HEAPU8.BYTES_PER_ELEMENT
    const arrayPointer = instance._malloc(arrayLength * bytesPerElement)
    instance.HEAPU8.set(input, arrayPointer / bytesPerElement)
  
    const ptr = instance.ccall('hash', 'number', ['number', 'number'], [arrayPointer, arrayLength])
  
    const buf = new Uint8Array(instance.HEAPU8.subarray(ptr, ptr + outLen));
    let res = new Array(outLen)
    for (let i = 0; i < buf.length; i++) {
      res[i] = buf[i].toString(16).padStart(2, 0)
    }
    
    instance._free(ptr)
    instance._free(arrayPointer)

    return res.join('')
  }
  return ''
}


module.exports = {
  init,
  destroy,
  md5
}
