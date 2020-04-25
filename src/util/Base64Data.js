import { brotliCompressSync, brotliDecompressSync, constants } from "zlib";
import * as wtf8 from "wtf-8";

const brotliOptions = {
  params: {
    [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT,
    [constants.BROTLI_PARAM_QUALITY]: 11,
  },
};

export const encodeBase64 = (value) => {
  const json = JSON.stringify(value);
  const encoded = wtf8.encode(json);
  const compressed_brotli = brotliCompressSync(encoded, brotliOptions);
  return compressed_brotli.toString("base64");
};

export const decodeBase64 = (data) => {
  const buffer = Buffer.from(data, "base64");
  const decompressed = brotliDecompressSync(buffer).toString();
  const decoded = wtf8.decode(decompressed);
  return JSON.parse(decoded);
};
