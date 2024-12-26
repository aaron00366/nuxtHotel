// import aes from "aes-js";
import CryptoJS from "crypto-js";

import { parse, stringify } from "zipson";

const AES_key = "1234567890123456"; // 密鑰
const AES_iv = "1234567890123456"; // 位移量
const key = CryptoJS.enc.Utf8.parse(AES_key);
const iv = CryptoJS.enc.Utf8.parse(AES_iv);

export const encrypt = (data) => {
  const encrypted = CryptoJS.AES.encrypt(stringify(data), key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return encrypted;
};

export const decrypt = (encrypted) => {
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
  const data = parse(decrypted);
  return data;
};

export default function () {
  function AesDecryptFromBase64(base64, key, iv) {
    var encriptDeviceBytes = Base64ToArray(base64);

    // 轉換 key -> key[32]
    var keys = aes.utils.utf8.toBytes(key);
    if (keys.length < 32) {
      const buffer = new ArrayBuffer(32);
      const uint8 = new Uint8Array(buffer);
      uint8.set(keys, 0);
      keys = uint8;
    }
    keys = keys.slice(0, 32);

    // 轉換 iv -> iv[16]
    var ivs = aes.utils.utf8.toBytes(iv);
    if (ivs.length < 16) {
      const buffer = new ArrayBuffer(16);
      const uint8 = new Uint8Array(buffer);
      uint8.set(ivs, 0);
      ivs = uint8;
    }
    ivs = ivs.slice(0, 16);

    // eslint-disable-next-line new-cap
    var aesCbc = new aes.ModeOfOperation.cbc(keys, ivs);
    var decryptedBytes = aesCbc.decrypt(encriptDeviceBytes);
    var decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);
    // eslint-disable-next-line no-control-regex
    return decryptedText.replace(/[\x00-\x1F]/g, "");
  }

  function AesDecryptFromHex(hex, key, iv) {
    var encriptDeviceBytes = aes.utils.hex.toBytes(hex);

    // 轉換 key -> key[32]
    var keys = aes.utils.utf8.toBytes(key);
    if (keys.length < 32) {
      const buffer = new ArrayBuffer(32);
      const uint8 = new Uint8Array(buffer);
      uint8.set(keys, 0);
      keys = uint8;
    }
    keys = keys.slice(0, 32);

    // 轉換 iv -> iv[16]
    var ivs = aes.utils.utf8.toBytes(iv);
    if (ivs.length < 16) {
      const buffer = new ArrayBuffer(16);
      const uint8 = new Uint8Array(buffer);
      uint8.set(ivs, 0);
      ivs = uint8;
    }
    ivs = ivs.slice(0, 16);

    // eslint-disable-next-line new-cap
    var aesCbc = new aes.ModeOfOperation.cbc(keys, ivs);
    var decryptedBytes = aesCbc.decrypt(encriptDeviceBytes);
    var decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);
    // eslint-disable-next-line no-control-regex
    return decryptedText.replace(/[\x00-\x1F]/g, "");
  }

  function Base64ToArray(base64) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function TripleDESDecrypt(base64content, keyStr = "fore!2024!3D") {
    var keyHex = CryptoJS.enc.Utf8.parse(keyStr);

    // 解密
    var decryptedData = CryptoJS.TripleDES.decrypt(base64content, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
    console.log(decryptedStr);
    return decryptedStr;
  }

  /**
   * 文字轉 16 進位
   * @param {String} value 文字
   * @returns Hex String
   */
  function StringToHex(value) {
    return CryptoJS.enc.Hex.stringify(CryptoJS.enc.Utf8.parse(value));
  }

  /**
   * 16 進位轉文字
   * @param {String} hex 16進位文字
   * @returns String
   */
  function HexToString(hex) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Hex.parse(hex));
  }

  /**
   * SHA-256
   * @param {String} value 文字
   * @returns String
   */
  function SHA256(value) {
    return CryptoJS.SHA256(value).toString();
  }

  return {
    AesDecryptFromBase64,
    AesDecryptFromHex,
    TripleDESDecrypt,
    StringToHex,
    HexToString,
    SHA256,
  };
}
