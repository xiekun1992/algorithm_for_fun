// 支持浏览器和nodejs中通用，并且处理超过1GB的大文件计算
// 准备初始数据和空间
const T = new Int32Array(65) // 浪费第一个4字节
for (let i = 1; i <= 64; i++) {
  T[i] = Math.floor(4294967296 * Math.abs(Math.sin(i)))
}
const maxInt = 4294967296
let A, B, C, D

let X = []
function md5(input) { // input是4字节整型数组
  A = 0x67452301
  B = 0xefcdab89
  C = 0x98badcfe
  D = 0x10325476
  // 计算padding所需大小
  const N0 = Math.floor(input.byteLength / 64)
    // console.log('N0=', N0)
  const tmp = new Uint8Array(input)
  // 先处理完整的分组
  for (let i = 0; i < N0 * 64; i += 64) {
    const group = new Int32Array(16)
    const tmpBytesGroup = tmp.subarray(i, i + 64)
    for (let j = 0; j < group.length; j++) {
      const tmp1 = (tmpBytesGroup[j * 4] * Math.pow(2, 24)) + (tmpBytesGroup[j * 4 + 1] * Math.pow(2, 16)) + (tmpBytesGroup[j * 4 + 2] * Math.pow(2, 8)) + tmpBytesGroup[j * 4 + 3]
      group[j] = (tmp1 >>> 24) & 0xff | (tmp1 >>> 8) & 0xff00 | ((tmp1 & 0xff00) << 8) | ((tmp1 & 0xff) << 24)
    }
    // const st = performance.now()
    md5GroupCalc(group)
    // console.log(i, 'group', performance.now() - st)
  }
  // 再处理padding的分组
  const lastGroupBytes = input.byteLength % 64 // 每组16个4字节整数
  const padBytes = 55 - lastGroupBytes

  const inputBits = input.byteLength * 8
  const padGroups = []
  if (padBytes > 0) {
    //  console.log('padBytes > 0')
    // existBytes + 0x80 + padBytes + 8
    const tmpInt8Array = new Int8Array(64)
    const last = tmp.subarray(N0 * 64)
    tmpInt8Array.set(last, 0)
    tmpInt8Array[last.length] = 0x80
    writeInputBitsLength(tmpInt8Array, inputBits)
    //  console.log(tmpInt8Array)
    const group = new Int32Array(tmpInt8Array.buffer)
    group[group.length - 2] = inputBits

    //  console.log(group)
    padGroups.push(group)
  } else if (padBytes < 0) {
    //  console.log('padBytes < 0')
    // existBytes + 0x80 + -padBytes + 64 + 8 两个分组
    const tmpInt8Array = new Int8Array(64)
    const last = tmp.subarray(N0 * 64)
    tmpInt8Array.set(last, 0)
    tmpInt8Array[last.length] = 0x80
    const group1 = new Int32Array(tmpInt8Array.buffer)
    
    const tmpGroup2 = new Int8Array(64)
    writeInputBitsLength(tmpGroup2, inputBits)
    const group2 = new Int32Array(tmpGroup2.buffer)
    group2[group2.length - 2] = inputBits

    padGroups.push(group1, group2)
  } else {
    //  console.log('padBytes == 0')
    // 0x80 + 8
    const tmpInt8Array = new Int8Array(64)
    const last = tmp.subarray(N0 * 64)
    tmpInt8Array.set(last, 0)
    tmpInt8Array[last.length] = 0x80
    writeInputBitsLength(tmpInt8Array, inputBits)
    
    const group = new Int32Array(tmpInt8Array.buffer)
    group[group.length - 2] = inputBits

    padGroups.push(group)
  }
  for (let i = 0; i < padGroups.length; i++) {
    md5GroupCalc(padGroups[i])
  }

  return lowOrderOutput(A) + lowOrderOutput(B) + lowOrderOutput(C) + lowOrderOutput(D)
}
function writeInputBitsLength(group, inputBits) {
  //  console.log(inputBits)
  const highPosValue = inputBits / maxInt
  const lowPosValue = inputBits % maxInt

  group[group.length - 8] = lowPosValue & 0xff
  group[group.length - 7] = (lowPosValue & 0xff00) >>> (1 * 8)
  group[group.length - 6] = (lowPosValue & 0xff0000) >>> (2 * 8)
  group[group.length - 5] = (lowPosValue & 0xff000000) >>> (3 * 8)
  
  group[group.length - 4] = (highPosValue & 0xff) >>> (4 * 8)
  group[group.length - 3] = (highPosValue & 0xff00) >>> (5 * 8)
  group[group.length - 2] = (highPosValue & 0xff0000) >>> (6 * 8)
  group[group.length - 1] = (highPosValue & 0xff000000) >>> (7 * 8)
}
function md5GroupCalc(group) {
  X = group
  let AA = A
  let BB = B
  let CC = C
  let DD = D
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
  const tmp = num.toString(16)
  if (tmp.length < 2) {
    return '0' + tmp
  }
  return tmp
}

 module.exports = {
   md5
 }