function sha1(buf) {

    let H = new Uint32Array(5)
    H[0] = 0x67452301
    H[1] = 0xEFCDAB89
    H[2] = 0x98BADCFE
    H[3] = 0x10325476
    H[4] = 0xC3D2E1F0
    
    let K = new Uint32Array(4)
    K[0] = 0x5A827999
    K[1] = 0x6ED9EBA1
    K[2] = 0x8F1BBCDC
    K[3] = 0xCA62C1D6
    
    //<--------- padding message---------->
    let padBuf
    const lastGroupBits = buf.length * 8 % 512
    const deltaBytes = (lastGroupBits - 440) / 8
    if (deltaBytes > 0) { // (440, 512)
        padBuf = Buffer.concat([buf, Buffer.from([0b10000000]), Buffer.alloc(64 - deltaBytes), Buffer.alloc(8)])
        padBuf.writeBigUInt64BE(BigInt(buf.length * 8), padBuf.length - 8)
    } else if (deltaBytes < 0) {
        padBuf = Buffer.concat([buf, Buffer.from([0b10000000]), Buffer.alloc(-deltaBytes), Buffer.alloc(8)])
        padBuf.writeBigUInt64BE(BigInt(buf.length * 8), padBuf.length - 8)
    } else {
        padBuf = buf
    }
    // <------------ groups -------------->
    for (let i = 0; i < padBuf.length / 64; i++) {
        // console.log(H, padBuf.slice(i * 64, 64))
        oneTurn(padBuf.slice(i * 64, (i + 1) * 64))
    }
    
    function oneTurn(buf) {
        var arr = new Uint8Array(buf) // 512 bits
        // console.log(arr, buf.buffer)
        var groups80 = new Uint32Array(80)
        var dataView = new DataView(groups80.buffer)
        for (let i = 0; i < 64; i += 4) {
            dataView.setUint32(i, arr[i] * Math.pow(2, 24) + arr[i + 1] * Math.pow(2, 16) + arr[i + 2] * Math.pow(2, 8) + arr[i + 3], true)
        }
        for (let i = 16; i <= 79; i++) {
            groups80[i] = s(1, (groups80[i - 3] ^ groups80[i - 8] ^ groups80[i - 14] ^ groups80[i - 16]))
        }
        // console.log(groups80)
        let ABCDE = new Uint32Array(5)
        ABCDE[0] = H[0]
        ABCDE[1] = H[1]
        ABCDE[2] = H[2]
        ABCDE[3] = H[3]
        ABCDE[4] = H[4]
        
        function k(t) {
            if(0 <= t && t <= 19) return K[0]
            if(20 <= t && t <= 39) return K[1]
            if(40 <= t && t <= 59) return K[2]
            if(60 <= t && t <= 79) return K[3]
        }
        function f(t, B, C, D) {
            if(0 <= t && t <= 19) return (ABCDE[1] & ABCDE[2]) | ((0xffffffff ^ ABCDE[1]) & ABCDE[3]) 
            if(20 <= t && t <= 39) return ABCDE[1] ^ ABCDE[2] ^ ABCDE[3]
            if(40 <= t && t <= 59) return (ABCDE[1] & ABCDE[2]) | (ABCDE[1] & ABCDE[3]) | (ABCDE[2] & ABCDE[3])
            if(60 <= t && t <= 79) return ABCDE[1] ^ ABCDE[2] ^ ABCDE[3]
        }
        function s(bits, number) {
            const temp = new Uint32Array(1)
            temp[0] = number
            return (temp[0] << bits) | (temp[0] >>> (32 - bits))
        }
        
        const temp = new Uint32Array(1)
        const temp0 = new Uint32Array(1)
        for (let i = 0; i <= 79; i++) {
            temp[0] = s(5, ABCDE[0])
            temp0[0] = f(i, ABCDE[1], ABCDE[2], ABCDE[3])
            temp[0] += temp0[0]
            temp[0] += ABCDE[4]
            temp[0] += groups80[i]
            temp0[0] = k(i)
            temp[0] += temp0[0]
    
            ABCDE[4] = ABCDE[3]
            ABCDE[3] = ABCDE[2]
            ABCDE[2] = s(30, ABCDE[1])
            ABCDE[1] = ABCDE[0]
            ABCDE[0] = temp[0]
        }
        
        H[0] = H[0] + ABCDE[0]
        H[1] = H[1] + ABCDE[1]
        H[2] = H[2] + ABCDE[2]
        H[3] = H[3] + ABCDE[3]
        H[4] = H[4] + ABCDE[4]
    
        return H
    }
    function padHex(num) {
        return num.toString(16).padStart(8, 0)
    }
    return padHex(H[0]) + padHex(H[1]) + padHex(H[2]) + padHex(H[3]) + padHex(H[4])
}

module.exports = {
    sha1
}