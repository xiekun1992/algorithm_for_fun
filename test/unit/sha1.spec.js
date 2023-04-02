const assert = require('assert')
const crypto = require('crypto')
const { sha1: xsha1 } = require('../../src/cryptographics/sha1')
const { calcHelper } = require('./helper')

describe('SHA1', () => {
  let sha1
  beforeEach(() => {
    sha1 = crypto.createHash('sha1')
  })
  it('empty buffer', () => {
    const buf = Buffer.alloc(0)
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('1 byte buffer', () => {
    const buf = Buffer.alloc(1, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('55 bytes buffer', () => {
    const buf = Buffer.alloc(55, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('56 bytes buffer', () => {
    const buf = Buffer.alloc(56, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('64 bytes buffer', () => {
    const buf = Buffer.alloc(64, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('65 bytes buffer', () => {
    const buf = Buffer.alloc(65, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('128 bytes buffer', () => {
    const buf = Buffer.alloc(128, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('1M bytes buffer', () => {
    const buf = Buffer.alloc(1024 * 1024, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('10M bytes buffer', function(done) {
    this.timeout(10000)
    const buf = Buffer.alloc(10 * 1024 * 1024, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
    done()
  })
})