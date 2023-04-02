const assert = require('assert')
const crypto = require('crypto')
const { md5: xmd5 } = require('../../src/cryptographics/md5')
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
  it('string `a`', () => {
    const buf = Buffer.from('a')
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('string `abc`', () => {
    const buf = Buffer.from('abc')
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('string `message digest`', () => {
    const buf = Buffer.from('message digest')
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('string `abcdefghijklmnopqrstuvwxyz`', () => {
    const buf = Buffer.from('abcdefghijklmnopqrstuvwxyz')
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('string `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`', () => {
    const buf = Buffer.from('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
  it('string `123456789012345678901234567890123456789012345678901234567890123456`', () => {
    const buf = Buffer.from('123456789012345678901234567890123456789012345678901234567890123456')
    assert.equal.apply(null, calcHelper(buf, md5, xmd5))
  })
})