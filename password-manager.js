"use strict";

/*** External Imports ****/
const { stringToBuffer, bufferToString, encodeBuffer, decodeBuffer, getRandomBytes } = require("./lib");
const { subtle } = require('crypto').webcrypto;

/*** Constants ****/
const PBKDF2_ITERATIONS = 100000; // number of iterations for PBKDF2 algorithm
const MAX_PASSWORD_LENGTH = 64;   // we can assume no password is longer than this many characters

/*** Implementation ****/
class Keychain {
  constructor() {
    this.data = {}; // Store member variables that you intend to be public here
    this.secrets = {}; // Store member variables that you intend to be private here
  }

  static async init(password) {
    const keychain = new Keychain();
    keychain.secrets.masterKey = await keychain.deriveKey(password);
    return keychain;
  }

  async deriveKey(password, name) {
    const salt = getRandomBytes(16);
    const keyMaterial = await subtle.importKey(
      'raw',
      stringToBuffer(password + (name || "")), // Include name in key derivation if provided
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );
    const key = await subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    this.secrets.salt = encodeBuffer(salt);
    return key;
  }

  async set(name, value, publicKeys) {
    if (publicKeys) {
      const encryptedValue = await this.encryptForMultipleUsers(value, publicKeys);
      const encodedName = encodeBuffer(stringToBuffer(name));
      this.data[encodedName] = encodeBuffer(encryptedValue);
    } else {
      const key = await this.deriveKey(this.secrets.masterKey, name);
      const paddedValue = value.padEnd(MAX_PASSWORD_LENGTH, ' ');
      const encodedName = encodeBuffer(stringToBuffer(name));
      const encodedValue = encodeBuffer(stringToBuffer(paddedValue));
      this.data[encodedName] = encodedValue;
    }
  }

  async get(name, privateKey) {
    const encodedName = encodeBuffer(stringToBuffer(name));
    const encodedValue = this.data[encodedName];
    if (privateKey) {
      return await this.decryptWithPrivateKey(encodedValue, privateKey);
    } else if (encodedValue) {
      const key = await this.deriveKey(this.secrets.masterKey, name);
      return bufferToString(decodeBuffer(encodedValue)).trim();
    }
    return null;
  }

  async remove(name) {
    const encodedName = encodeBuffer(stringToBuffer(name));
    if (encodedName in this.data) {
      delete this.data[encodedName];
      return true;
    }
    return false;
  }

  async dump() {
    const kvs = { ...this.data }; // Include the KVS object in the dump
    const paddedKVS = this.padToTenEntries(kvs);
    const dataString = JSON.stringify({ kvs: paddedKVS });
    const dataBuffer = stringToBuffer(dataString);
    const hashBuffer = await subtle.digest('SHA-256', dataBuffer);
    const hashString = encodeBuffer(hashBuffer);
    return [dataString, hashString];
  }

  static async load(password, repr, trustedDataCheck) {
    const parsedData = JSON.parse(repr);
    if (trustedDataCheck) {
      const dataBuffer = stringToBuffer(repr);
      const hashBuffer = await subtle.digest('SHA-256', dataBuffer);
      const hashString = encodeBuffer(hashBuffer);
      if (hashString !== trustedDataCheck) {
        throw new Error("Integrity check failed");
      }
    }

    const keychain = new Keychain();
    try {
      // Attempt to derive the master key using the provided password
      keychain.secrets.masterKey = await keychain.deriveKey(password);
    } catch (error) {
      return false; // If an error is caught, return false indicating invalid password
    }

    keychain.data = parsedData.kvs; // Restore the KVS object from the parsed data
    return keychain;
  }

  async encryptForMultipleUsers(value, publicKeys) {
    const promises = publicKeys.map(key => subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      stringToBuffer(value)
    ));
    const encryptedValues = await Promise.all(promises);
    return encryptedValues.map(buffer => encodeBuffer(buffer)).join(';');
  }

  async decryptWithPrivateKey(encryptedValue, privateKey) {
    const encryptedBuffers = encryptedValue.split(';').map(decodeBuffer);
    for (const buffer of encryptedBuffers) {
      try {
        const decrypted = await subtle.decrypt(
          { name: 'RSA-OAEP' },
          privateKey,
          buffer
        );
        return bufferToString(decrypted);
      } catch (e) {
        continue; // Try next buffer
      }
    }
    throw new Error('Decryption failed');
  }

  padToTenEntries(kvs) {
    const size = Object.keys(kvs).length;
    const paddedKVS = { ...kvs };
    for (let i = size; i < 10; i++) {
      paddedKVS[`_pad_${i}`] = null; // Add dummy entries
    }
    return paddedKVS;
  }

  async generateRandomizedMACs(name) {
    const macs = [];
    for (let i = 0; i < 5; i++) { // Example: generating 5 different MACs
      const mac = await subtle.digest('SHA-256', stringToBuffer(name + getRandomBytes(16)));
      macs.push(encodeBuffer(mac));
    }
    return macs;
  }
}

module.exports = { Keychain };
