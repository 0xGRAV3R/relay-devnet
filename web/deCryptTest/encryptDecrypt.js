const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');
const bs58 = require('bs58');

// Example message to encrypt
const message = 'Hello, this is a secret message!';

// Generate keypairs for the sender and recipient
const senderKeyPair = nacl.box.keyPair();
const recipientKeyPair = nacl.box.keyPair();

// Encrypt the message
const nonce = nacl.randomBytes(nacl.box.nonceLength);
const sharedSecret = nacl.box.before(recipientKeyPair.publicKey, senderKeyPair.secretKey);
const encryptedMessage = nacl.box.after(naclUtil.decodeUTF8(message), nonce, sharedSecret);

const encryptedMessageBase64 = naclUtil.encodeBase64(encryptedMessage);
const nonceBase64 = naclUtil.encodeBase64(nonce);
const senderPublicKeyBase58 = bs58.encode(senderKeyPair.publicKey);

console.log('Encrypted message:', encryptedMessageBase64);
console.log('Nonce:', nonceBase64);
console.log('Sender Public Key:', senderPublicKeyBase58);

// Decrypt the message
const decryptSharedSecret = nacl.box.before(senderKeyPair.publicKey, recipientKeyPair.secretKey);
const decryptedMessage = nacl.box.open.after(encryptedMessage, nonce, decryptSharedSecret);

if (decryptedMessage) {
  console.log('Decrypted message:', naclUtil.encodeUTF8(decryptedMessage));
} else {
  console.log('Failed to decrypt the message');
}
