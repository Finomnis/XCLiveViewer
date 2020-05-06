import { deflate, inflate } from "pako";

import * as cbor from "cbor";

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
    return cbor_data_compressed.toString("base64");
  } else {
    return cbor_data_uncompressed.toString("base64");
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
