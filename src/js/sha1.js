let H = new Uint32Array(5)
let K = new Uint32Array(4)

function sha1(buf) {
    H[0] = 0x67452301
    H[1] = 0xEFCDAB89
    H[2] = 0x98BADCFE
    H[3] = 0x10325476
    H[4] = 0xC3D2E1F0
    
    K[0] = 0x5A827999
    K[1] = 0x6ED9EBA1
    K[2] = 0x8F1BBCDC
    K[3] = 0xCA62C1D6
    
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
    padBuf.writeBigUInt64BE(BigInt(buf.length * 8), padBuf.length - 8)
    // <------------ groups -------------->
    for (let i = 0; i < padBuf.length / 64; i++) {
        oneTurn(padBuf.slice(i * 64, (i + 1) * 64))
    }
    // <------------ output -------------->
    return padHex(H[0]) + padHex(H[1]) + padHex(H[2]) + padHex(H[3]) + padHex(H[4])
}
function oneTurn(buf) {
    var arr = new Uint8Array(buf) // 512 bits
    var groups80 = new Uint32Array(80)
    var dataView = new DataView(groups80.buffer)
    for (let i = 0; i < 64; i += 4) {
        dataView.setUint32(i, arr[i] * Math.pow(2, 24) + arr[i + 1] * Math.pow(2, 16) + arr[i + 2] * Math.pow(2, 8) + arr[i + 3], true)
    }
    for (let i = 16; i <= 79; i++) {
        groups80[i] = s(1, (groups80[i - 3] ^ groups80[i - 8] ^ groups80[i - 14] ^ groups80[i - 16]))
    }
    let ABCDE = new Uint32Array(5)
    ABCDE[0] = H[0]
    ABCDE[1] = H[1]
    ABCDE[2] = H[2]
    ABCDE[3] = H[3]
    ABCDE[4] = H[4]
    
    for (let i = 0; i <= 79; i++) {
        const temp = s(5, ABCDE[0]) + f(i, ABCDE[1], ABCDE[2], ABCDE[3]) + ABCDE[4] + groups80[i] + k(i)

        ABCDE[4] = ABCDE[3]
        ABCDE[3] = ABCDE[2]
        ABCDE[2] = s(30, ABCDE[1])
        ABCDE[1] = ABCDE[0]
        ABCDE[0] = temp
    }
    
    H[0] = H[0] + ABCDE[0]
    H[1] = H[1] + ABCDE[1]
    H[2] = H[2] + ABCDE[2]
    H[3] = H[3] + ABCDE[3]
    H[4] = H[4] + ABCDE[4]

    return H
}
function k(t) {
    if(t <= 19) return K[0] // (0, 19)
    else if(20 <= t && t <= 39) return K[1] // (20, 39)
    else if(40 <= t && t <= 59) return K[2] // (40, 59)
    else return K[3] // (60, 79)
}
function f(t, B, C, D) {
    if(t <= 19) return (B & C) | ((0xffffffff ^ B) & D) // (0, 19)
    else if(20 <= t && t <= 39) return B ^ C ^ D // (20, 39)
    else if(40 <= t && t <= 59) return (B & C) | (B & D) | (C & D) // (40, 59)
    else return B ^ C ^ D // (60, 79)
}
function s(bits, number) {
    return (number << bits) | (number >>> (32 - bits))
}
function padHex(num) {
    return num.toString(16).padStart(8, 0)
}
module.exports = {
    sha1
}