import { deflate, inflate } from "pako";

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
  const json = JSON.stringify(value);
  const encoded = encodeUtf8(json);
  const compressed_brotli = deflate(encoded);
  return Buffer.from(compressed_brotli).toString("base64");
};

export const decodeBase64 = (data) => {
  const buffer = Buffer.from(data, "base64");
  const decompressed = inflate(buffer);
  const decoded = decodeUtf8(decompressed);
  return JSON.parse(decoded);
};
