const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');

// var naclUtil = nacl.util

// Getting keypair from a key
const x25519_from_key = (key) => {
    console.log(key.length)
    const boxKeyPair = nacl.box.keyPair.fromSecretKey(key);
    const secretKey = boxKeyPair.secretKey;
    const publicKey = boxKeyPair.publicKey;

    const result = {
        publicKey:
        {
            uint: publicKey,
            base64: naclUtil.encodeBase64(publicKey)
        },
        secretKey: {
            uint: secretKey,
            base64: naclUtil.encodeBase64(secretKey)
        }
    }

    return result;
};

// Encrypt message using the own secret key and the public key of the other side
const encryptMessage = (message, x25519_public_uint, x25519_secret_key) => {

    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const message_decoded = naclUtil.decodeUTF8(message);


    console.log("Encrypt x25519_public_uint", naclUtil.encodeBase64(x25519_public_uint));
    
    console.log("Encrypt x25519_secret_key", naclUtil.encodeBase64(x25519_secret_key));

    const encrypted_message = nacl.box(
        message_decoded,
        nonce,
        x25519_public_uint,
        x25519_secret_key
    );

    return {
        nonce_base64: naclUtil.encodeBase64(nonce),
        encrypted_message_encoded: naclUtil.encodeBase64(encrypted_message),
    };
};

// Decrypt message using the own secret key and the public key of the other side
const decryptMessage = (encrypted_message, nonce_base64, x25519_public_uint, x25519_secret_key) => {
  
    const nonce = naclUtil.decodeBase64(nonce_base64);
    const encrypted_message_decoded = naclUtil.decodeBase64(encrypted_message);
    const decrypted_message = nacl.box.open(
      encrypted_message_decoded,
      nonce,
      x25519_public_uint,
      x25519_secret_key
    );


    console.log("Decrypt x25519_public_uint", naclUtil.encodeBase64(x25519_public_uint));
    console.log("Decrypt x25519_secret_key", naclUtil.encodeBase64(x25519_secret_key));

    return naclUtil.encodeUTF8(decrypted_message);
  };
  

// Generating keypair x25519 for A and B side
const keyPairA = x25519_from_key(nacl.randomBytes(nacl.box.secretKeyLength));
const keyPairB = x25519_from_key(nacl.randomBytes(nacl.box.secretKeyLength));

console.log("keyPairA", keyPairA);
console.log("keyPairB", keyPairB);

// A side: Encrypt message using the own secret key (A side) and the public key of the other side (B side)
const message = 'This is a plain message';
const encrypted = encryptMessage(message, keyPairB.publicKey.uint, keyPairA.secretKey.uint);

console.log('Original message:', message);

// Show encrypted message
console.log('Encrypted message:', encrypted.encrypted_message_encoded);
console.log('Nonce:', encrypted.nonce_base64);


// B side: Decrypt message using the own secret key (B side) and the public key of the other side (A side)
const decrypted = decryptMessage(encrypted.encrypted_message_encoded, encrypted.nonce_base64, keyPairA.publicKey.uint, keyPairB.secretKey.uint);
console.log('Decrypted message:', decrypted);