const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');
const bs58 = require('bs58');

// Encrypt the message
const encryptMessage = (message, recipientPubkeyBase58) => {
  const recipientPubkey = bs58.decode(recipientPubkeyBase58);
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const keyPair = nacl.box.keyPair();
  const sharedSecret = nacl.box.before(recipientPubkey, keyPair.secretKey);

  const encrypted = nacl.box.after(
    naclUtil.decodeUTF8(message),
    nonce,
    sharedSecret
  );

  return {
    nonce: naclUtil.encodeBase64(nonce),
    encrypted: naclUtil.encodeBase64(encrypted),
    senderPubkey: bs58.encode(keyPair.publicKey), // Save the sender's public key to use for decryption
  };
};

const message = 'Hello, this is a secret message!';
const recipientPubkeyBase58 = 'EDtUPcqZvK1xsfeXC7zBhzwgDSyoS2Vm5gSXrP4Z76oc'; // Recipient's public key
const encryptedMessage = encryptMessage(message, recipientPubkeyBase58);

console.log(JSON.stringify(encryptedMessage));
