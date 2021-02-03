const assert = require('assert')
const crypto = require('crypto')
const { md5: xmd5 } = require('../src/md5')
const { calcHelper } = require('./helper')

describe('MD5', () => {
  let md5
  beforeEach(() => {
    md5 = crypto.createHash('md5')
  })
  it('empty buffer', () => {
    const buf = Buffer.alloc(0)
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('1 byte buffer', () => {
    const buf = Buffer.alloc(1, Math.random())
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('55 bytes buffer', () => {
    const buf = Buffer.alloc(55, Math.random())
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('56 bytes buffer', () => {
    const buf = Buffer.alloc(56, Math.random())
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('64 bytes buffer', () => {
    const buf = Buffer.alloc(64, Math.random())
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('65 bytes buffer', () => {
    const buf = Buffer.alloc(65, Math.random())
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('128 bytes buffer', () => {
    const buf = Buffer.alloc(128, Math.random())
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('1M bytes buffer', () => {
    const buf = Buffer.alloc(1024 * 1024, Math.random())
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('10M bytes buffer', () => {
    const buf = Buffer.alloc(10 * 1024 * 1024, Math.random())
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  // it('', () => {
  //   MD5 ("") = d41d8cd98f00b204e9800998ecf8427e
  //   MD5 ("a") = 0cc175b9c0f1b6a831c399e269772661
  //   MD5 ("abc") = 900150983cd24fb0d6963f7d28e17f72
  //   MD5 ("message digest") = f96b697d7cb7938d525a2f31aaf161d0
  //   MD5 ("abcdefghijklmnopqrstuvwxyz") = c3fcd3d76192e4007dfb496cca67e13b
  //   MD5 ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") =
  //   d174ab98d277d9f5a5611c2c9f419d9f
  //   MD5 ("123456789012345678901234567890123456789012345678901234567890123456
  //   78901234567890") = 57edf4a22be3c955ac49da2e2107b67a
  // })
})