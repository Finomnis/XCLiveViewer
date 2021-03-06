import { deflate, inflate } from "pako";

import * as cbor from "cbor";

function bufferToBase64Url(data) {
  const base64Encoded = data.toString("base64");
  const urlEscaped = base64Encoded
    .replace(/\+/g, "-") // Replace + with -
    .replace(/\//g, "_") // Replace / with _
    .replace(/=+$/, ""); // Remove padding =
  return urlEscaped;
}

function encodeUtf8(data) {
  // Needs to be imported explicitely for tests
  if (typeof TextEncoder === "undefined") {
    const { TextEncoder } = require("util");
    return new TextEncoder("utf-8").encode(data);
  } else {
    return new TextEncoder("utf-8").encode(data);
  }
}

function decodeUtf8(data) {
  // Needs to be imported explicitely for tests
  if (typeof TextDecoder === "undefined") {
    const { TextDecoder } = require("util");
    return new TextDecoder("utf-8").decode(data);
  } else {
    return new TextDecoder("utf-8").decode(data);
  }
}

export const encodeBase64 = (value) => {
  const cbor_value = Buffer.from(cbor.encode(value));
  const cbor_compressed = Buffer.from(deflate(cbor_value));

  const cbor_data_uncompressed = Buffer.concat([
    Buffer.from([0x1]),
    cbor_value,
  ]);
  const cbor_data_compressed = Buffer.concat([
    Buffer.from([0x2]),
    cbor_compressed,
  ]);

  if (cbor_data_compressed.length < cbor_data_uncompressed.length) {
    return bufferToBase64Url(cbor_data_compressed);
  } else {
    return bufferToBase64Url(cbor_data_uncompressed);
  }
};

export const decodeBase64 = (data_base64) => {
  const buffer = Buffer.from(data_base64, "base64");
  const data_type = buffer.slice(0, 1)[0];
  const data = buffer.slice(1);

  switch (data_type) {
    case 1:
      return cbor.decodeFirstSync(data);
    case 2:
      const decompressed = Buffer.from(inflate(data));
      return cbor.decodeFirstSync(decompressed);
    default:
      return null;
  }
};

// Compatibility with previous version
export const decodeBase64Json = (data) => {
  const buffer = Buffer.from(data, "base64");
  const decompressed = inflate(buffer);
  const decoded = decodeUtf8(decompressed);
  return JSON.parse(decoded);
};
export const encodeBase64Json = (value) => {
  const json = JSON.stringify(value);
  const encoded = encodeUtf8(json);
  const compressed_brotli = deflate(encoded);
  return bufferToBase64Url(Buffer.from(compressed_brotli));
};
