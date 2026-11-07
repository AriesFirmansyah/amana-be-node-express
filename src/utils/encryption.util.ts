import * as CryptoJS from "crypto-js";

export const EncryptionUtil = {
  AESencrypt: (plainText: string, SECRET_KEY: string): string => {
    // 1. Generate 8 byte salt
    const salt = CryptoJS.lib.WordArray.random(8);

    // 2. Derive key & iv (32 byte key, 16 byte IV)
    const { key, iv } = EncryptionUtil.deriveKeyAndIV(SECRET_KEY, salt);

    // 3. Encryption (AES-256-CBC, PKCS7)
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(plainText), // parse data to WordArray
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    // 4. format: "Salted__" + [8-byte salt] + [ciphertext]
    //    encrypted.ciphertext -> ciphertext results is WordArray
    const saltedPrefix = CryptoJS.enc.Utf8.parse("Salted__");
    const finalWordArray = saltedPrefix
      .clone()
      .concat(salt)
      .concat(encrypted.ciphertext);

    // 5. Return as base64 string
    return CryptoJS.enc.Base64.stringify(finalWordArray);
  },
  AESdecrypt: (decryptValue: string, SECRET_KEY: string): string => {
    const cipherText = decodeURIComponent(decryptValue);
    // 1. Decode base64
    const cipherBytes = CryptoJS.enc.Base64.parse(cipherText);

    // 2. Check prefix "Salted__" (2 words = 8 bytes, but contain ASCII => "Salted__")
    const saltedPrefix = CryptoJS.lib.WordArray.create(
      cipherBytes.words.slice(0, 2),
    );
    if (CryptoJS.enc.Utf8.stringify(saltedPrefix) !== "Salted__") {
      throw new Error("Invalid ciphertext format (missing 'Salted__')");
    }

    // 3. take salt (8 byte next)
    const salt = CryptoJS.lib.WordArray.create(cipherBytes.words.slice(2, 4));
    salt.sigBytes = 8; // make sure length 8 byte

    // 4. rest is ciphertext
    const encryptedData = CryptoJS.lib.WordArray.create(
      cipherBytes.words.slice(4),
    );

    // 5. Derive key & iv
    const { key, iv } = EncryptionUtil.deriveKeyAndIV(SECRET_KEY, salt);

    // 6. Decryption (AES-256-CBC, PKCS7)
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData } as CryptoJS.lib.CipherParams,
      key,
      {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );

    // 7. Convert results to string UTF-8
    return CryptoJS.enc.Utf8.stringify(decrypted);
  },
  deriveKeyAndIV: (password: string, salt: CryptoJS.lib.WordArray) => {
    const pass = CryptoJS.enc.Utf8.parse(password);

    //  total 48 byte = 32 (key) + 16 (IV)
    const keySize = 32; // bytes
    const ivSize = 16; // bytes
    const totalSize = keySize + ivSize; // 48 byte

    let derived = CryptoJS.lib.WordArray.create(); // saving accumulation MD5
    let block = CryptoJS.lib.WordArray.create(); // output MD5 per-iteration

    // MD5 loop untul derived length >= 48 byte
    while (derived.words.length * 4 < totalSize) {
      // block = MD5( block + pass + salt )
      block = CryptoJS.MD5(block.concat(pass).concat(salt));
      derived = derived.concat(block);
    }

    // separate key dan IV
    const key = CryptoJS.lib.WordArray.create(
      derived.words.slice(0, keySize / 4), // 32 byte = 8 words
    );
    const iv = CryptoJS.lib.WordArray.create(
      derived.words.slice(keySize / 4, (keySize + ivSize) / 4), // 16 byte = 4 words
    );

    // make sure sigBytes length is correct
    key.sigBytes = keySize;
    iv.sigBytes = ivSize;

    return { key, iv };
  },
};
