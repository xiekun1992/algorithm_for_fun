const assert = require('assert')
const crypto = require('crypto')
const { sha1: xsha1 } = require('../src/sha1')
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
  it('1 bits buffer', () => {
    const buf = Buffer.alloc(1, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('448 bits buffer', () => {
    const buf = Buffer.alloc(448, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('511 bits buffer', () => {
    const buf = Buffer.alloc(511, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('512 bits buffer', () => {
    const buf = Buffer.alloc(512, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('513 bits buffer', () => {
    const buf = Buffer.alloc(513, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('1023 bits buffer', () => {
    const buf = Buffer.alloc(1023, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('1024 bits buffer', () => {
    const buf = Buffer.alloc(1024, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('1M bits buffer', () => {
    const buf = Buffer.alloc(1024 * 1024, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
  it('10M bits buffer', () => {
    const buf = Buffer.alloc(10 * 1024 * 1024, Math.random())
    assert.equal.apply(null, calcHelper(buf, sha1, xsha1))
  })
})