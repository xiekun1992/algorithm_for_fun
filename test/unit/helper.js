function calcHelper(buf, hash1, hash2) {
  hash1.update(buf)
  const expect = hash1.digest('hex')
  const real = hash2(buf)
  
  // console.log(real, expect)
  return [real, expect]
}

module.exports = {
  calcHelper
}