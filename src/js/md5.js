let X = []
const T = []
for (let i = 1; i <= 64; i++) {
  T[i] = Math.floor(4294967296 * Math.abs(Math.sin(i))) & 0xffffffff // signed integer
}

function md5 (buf) {
  A = 0x67452301 & 0xffffffff
  B = 0xefcdab89 & 0xffffffff
  C = 0x98badcfe & 0xffffffff
  D = 0x10325476 & 0xffffffff
  // <--------- padding message---------->
  let padBuf
  const lastGroupBits = buf.length * 8 % 512
  const deltaBytes = (lastGroupBits - 440) / 8
  if (deltaBytes > 0) { // (440, 512)
    padBuf = Buffer.concat([buf, Buffer.from([0b10000000]), Buffer.alloc(64 - deltaBytes), Buffer.alloc(8)])
  } else if (deltaBytes < 0) {
    padBuf = Buffer.concat([buf, Buffer.from([0b10000000]), Buffer.alloc(-deltaBytes), Buffer.alloc(8)])
  } else {
    padBuf = Buffer.concat([buf, Buffer.from([0b10000000]), Buffer.alloc(8)])
  }
  padBuf.writeBigUInt64LE(BigInt(buf.length * 8), padBuf.length - 8)

  const N = padBuf.length * 8 / 32
  const M = []
  // convert byte to signed 32 bit integer with little endian format in M
  for (let i = 0; i < N; i++) {
    const tmp = padBuf[i * 4] * Math.pow(2, 24) + padBuf[i * 4 + 1] * Math.pow(2, 16) + padBuf[i * 4 + 2] * Math.pow(2, 8) + padBuf[i * 4 + 3]
    M[i] = (tmp >>> 24) & 0xff | (tmp >>> 8) & 0xff00 | ((tmp & 0xff00) << 8) | ((tmp & 0xff) << 24)
  }

  let AA, BB, CC, DD
  for (let i = 0; i <= N / 16 - 1; i++) {
    X = []
    for (let j = 0; j <= 15; j++) { // a group is 512 bits
      X[j] = M[i * 16 + j]
    }
    AA = A
    BB = B
    CC = C
    DD = D
    // round 1
    A = round1(A, B, C, D, 0, 7, 1)
    D = round1(D, A, B, C, 1, 12, 2)
    C = round1(C, D, A, B, 2, 17, 3)
    B = round1(B, C, D, A, 3, 22, 4)

    A = round1(A, B, C, D, 4, 7, 5)
    D = round1(D, A, B, C, 5, 12, 6)
    C = round1(C, D, A, B, 6, 17, 7)
    B = round1(B, C, D, A, 7, 22, 8)

    A = round1(A, B, C, D, 8, 7, 9)
    D = round1(D, A, B, C, 9, 12, 10)
    C = round1(C, D, A, B, 10, 17, 11)
    B = round1(B, C, D, A, 11, 22, 12)

    A = round1(A, B, C, D, 12, 7, 13)
    D = round1(D, A, B, C, 13, 12, 14)
    C = round1(C, D, A, B, 14, 17, 15)
    B = round1(B, C, D, A, 15, 22, 16)

    // round2
    A = round2(A, B, C, D, 1, 5, 17)
    D = round2(D, A, B, C, 6, 9, 18)
    C = round2(C, D, A, B, 11, 14, 19)
    B = round2(B, C, D, A, 0, 20, 20)

    A = round2(A, B, C, D, 5, 5, 21)
    D = round2(D, A, B, C, 10, 9, 22)
    C = round2(C, D, A, B, 15, 14, 23)
    B = round2(B, C, D, A, 4, 20, 24)

    A = round2(A, B, C, D, 9, 5, 25)
    D = round2(D, A, B, C, 14, 9, 26)
    C = round2(C, D, A, B, 3, 14, 27)
    B = round2(B, C, D, A, 8, 20, 28)

    A = round2(A, B, C, D, 13, 5, 29)
    D = round2(D, A, B, C, 2, 9, 30)
    C = round2(C, D, A, B, 7, 14, 31)
    B = round2(B, C, D, A, 12, 20, 32)

    // round3
    A = round3(A, B, C, D, 5, 4, 33)
    D = round3(D, A, B, C, 8, 11, 34)
    C = round3(C, D, A, B, 11, 16, 35)
    B = round3(B, C, D, A, 14, 23, 36)

    A = round3(A, B, C, D, 1, 4, 37)
    D = round3(D, A, B, C, 4, 11, 38)
    C = round3(C, D, A, B, 7, 16, 39)
    B = round3(B, C, D, A, 10, 23, 40)

    A = round3(A, B, C, D, 13, 4, 41)
    D = round3(D, A, B, C, 0, 11, 42)
    C = round3(C, D, A, B, 3, 16, 43)
    B = round3(B, C, D, A, 6, 23, 44)

    A = round3(A, B, C, D, 9, 4, 45)
    D = round3(D, A, B, C, 12, 11, 46)
    C = round3(C, D, A, B, 15, 16, 47)
    B = round3(B, C, D, A, 2, 23, 48)

    // round4
    A = round4(A, B, C, D, 0, 6, 49)
    D = round4(D, A, B, C, 7, 10, 50)
    C = round4(C, D, A, B, 14, 15, 51)
    B = round4(B, C, D, A, 5, 21, 52)

    A = round4(A, B, C, D, 12, 6, 53)
    D = round4(D, A, B, C, 3, 10, 54)
    C = round4(C, D, A, B, 10, 15, 55)
    B = round4(B, C, D, A, 1, 21, 56)

    A = round4(A, B, C, D, 8, 6, 57)
    D = round4(D, A, B, C, 15, 10, 58)
    C = round4(C, D, A, B, 6, 15, 59)
    B = round4(B, C, D, A, 13, 21, 60)

    A = round4(A, B, C, D, 4, 6, 61)
    D = round4(D, A, B, C, 11, 10, 62)
    C = round4(C, D, A, B, 2, 15, 63)
    B = round4(B, C, D, A, 9, 21, 64)

    A = A + AA
    B = B + BB
    C = C + CC
    D = D + DD
  }
  // <------------ output -------------->
  return lowOrderOutput(A) + lowOrderOutput(B) + lowOrderOutput(C) + lowOrderOutput(D)
}
function round1(A, B, C, D, k, s, i) {
  const tmp = (A + F(B, C, D) + X[k] + T[i])
  return (B + circularShiftLeft(tmp, s)) & 0xffffffff
}
function round2(A, B, C, D, k, s, i) {
  const tmp = (A + G(B, C, D) + X[k] + T[i])
  return (B + circularShiftLeft(tmp, s)) & 0xffffffff
}
function round3(A, B, C, D, k, s, i) {
  const tmp = (A + H(B, C, D) + X[k] + T[i])
  return (B + circularShiftLeft(tmp, s)) & 0xffffffff
}
function round4(A, B, C, D, k, s, i) {
  const tmp = (A + I(B, C, D) + X[k] + T[i])
  return (B + circularShiftLeft(tmp, s)) & 0xffffffff
}
function circularShiftLeft(value, shiftBits) {
  return (value << shiftBits | value >>> (32 - shiftBits)) & 0xffffffff
}
function F(X,Y,Z) {
  return ((X & Y) | (~X & Z))
}
function G(X,Y,Z) {
  return (X & Z) | (Y & ~Z)
}
function H(X,Y,Z) {
  return X ^ Y ^ Z
}
function I(X,Y,Z) {
  return Y ^ (X | ~Z)
}
// 32bits number change to little endian format eg. 0xabcdefgh => 0xghdebcab
function lowOrderOutput(num) {
  return padHex(num & 0xff) + padHex((num >>> 8) & 0xff) + padHex((num >>> 16) & 0xff) + padHex((num >>> 24) & 0xff)
}
function padHex(num) {
  const tmp = num.toString(16).padStart(2, 0)
  return tmp
}
module.exports = {
  md5
}