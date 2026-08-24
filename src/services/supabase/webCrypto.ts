import * as ExpoCrypto from "expo-crypto";

type MutableGlobal = {
  crypto?: {
    getRandomValues?: unknown;
    subtle?: unknown;
  };
  TextEncoder?: unknown;
};

const target = globalThis as unknown as MutableGlobal;

if (!target.crypto) {
  target.crypto = {};
}

if (typeof target.crypto.getRandomValues !== "function") {
  target.crypto.getRandomValues = <T extends ArrayBufferView>(array: T): T =>
    ExpoCrypto.getRandomValues(array as never) as T;
}

if (!target.crypto.subtle) {
  target.crypto.subtle = {
    digest: (algorithm: string | { name: string }, data: BufferSource) =>
      ExpoCrypto.digest(
        (typeof algorithm === "string"
          ? algorithm
          : algorithm.name) as ExpoCrypto.CryptoDigestAlgorithm,
        data,
      ),
  };
}

if (typeof target.TextEncoder === "undefined") {
  target.TextEncoder = class {
    readonly encoding = "utf-8";

    encode(input: string): Uint8Array {
      const bytes: number[] = [];

      for (let index = 0; index < input.length; index += 1) {
        let code = input.charCodeAt(index);

        if (code < 0x80) {
          bytes.push(code);
        } else if (code < 0x800) {
          bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code >= 0xd800 && code <= 0xdbff) {
          index += 1;
          const low = input.charCodeAt(index);
          code = 0x10000 + ((code - 0xd800) << 10) + (low - 0xdc00);
          bytes.push(
            0xf0 | (code >> 18),
            0x80 | ((code >> 12) & 0x3f),
            0x80 | ((code >> 6) & 0x3f),
            0x80 | (code & 0x3f),
          );
        } else {
          bytes.push(
            0xe0 | (code >> 12),
            0x80 | ((code >> 6) & 0x3f),
            0x80 | (code & 0x3f),
          );
        }
      }

      return new Uint8Array(bytes);
    }
  };
}
