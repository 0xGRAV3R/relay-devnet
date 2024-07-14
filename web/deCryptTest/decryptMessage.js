const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');
const bs58 = require('bs58');

// Recipient's private key (Base58 encoded for Solana)
const recipientPrivateKeyBase58 = 'zoe98U6JBQzzc3qQDUZBbjEqwb4sPBeW7CrHucrnqxqeSSQiGTRZnBUD24WvKibBpVkhWqvAhboxyEs8ZeasYvv';

// Message (from JSON)
const messageJson = '{"nonce":"8zaIFc05X66EKq9tClTDE3LjyB52JHIh","encrypted":"WANpYKwJyx1a6ra+U7ZMR9HK5cDUrIc5tS/tIWHiUPxgQPRNuXpTj8DXiEFs3Lqp","senderPubkey":"3ystPT61GEHt26TdnT91g1teaFF2CKyjnR31CyQDN7yC"}';
const message = JSON.parse(messageJson);

// Convert recipient's private key from Base58 to Uint8Array
const recipientPrivateKey = bs58.decode(recipientPrivateKeyBase58);

// Convert nonce and encrypted message from Base64 to Uint8Array
const nonce = naclUtil.decodeBase64(message.nonce);
const encrypted = naclUtil.decodeBase64(message.encrypted);

// Generate recipient's keypair from the secret key
const recipientKeyPair = nacl.box.keyPair.fromSecretKey(recipientPrivateKey);

// The sender's public key from the encrypted message
const senderPublicKey = bs58.decode(message.senderPubkey);

// Compute the shared secret
const sharedSecret = nacl.box.before(senderPublicKey, recipientKeyPair.secretKey);

// Decrypt the message using the shared secret
const decrypted = nacl.box.open.after(encrypted, nonce, sharedSecret);

if (decrypted) {
  console.log('Decrypted message:', naclUtil.encodeUTF8(decrypted));
} else {
  console.log('Failed to decrypt the message');
}
