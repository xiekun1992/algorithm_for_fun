#include <stdio.h>
#include <emscripten.h>
#include "md5.h"

EMSCRIPTEN_KEEPALIVE
uint8_t* hash(int* in_ptr, int len) {
    MD5_CTX ctx = {0};
    unsigned char *digest = (unsigned char*)malloc(16);
    
    MD5Init(&ctx);
    MD5Update(&ctx, in_ptr, len);
    MD5Final(digest, &ctx);

    return (uint8_t*)digest;
}

// emcc md5_wrapper.c md5.c -o md5_wrapper.js -s MODULARIZE -s EXPORTED_RUNTIME_METHODS=['ccall','cwrap'] -s EXPORTED_FUNCTIONS=['_malloc','_free'] -s ALLOW_MEMORY_GROWTH=1 -O3