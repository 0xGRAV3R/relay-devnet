const nacl = require('tweetnacl');
const naclUtil = require('tweetnacl-util');
const bs58 = require('bs58');

// Convert Ed25519 key to X25519
function ed25519ToX25519(ed25519Key) {
  const keyPair = nacl.sign.keyPair.fromSeed(ed25519Key.slice(0, 32));
  return keyPair.secretKey;
}

// Convert Ed25519 public key to X25519
function ed25519PublicToX25519Public(ed25519PublicKey) {
  return nacl.box.keyPair.fromSecretKey(ed25519PublicKey.slice(0, 32)).publicKey;
}

// Recipient's public key and private key (Base58 encoded for Solana)
const recipientPublicKeyBase58 = 'EDtUPcqZvK1xsfeXC7zBhzwgDSyoS2Vm5gSXrP4Z76oc';
const recipientPrivateKeyBase58 = 'zoe98U6JBQzzc3qQDUZBbjEqwb4sPBeW7CrHucrnqxqeSSQiGTRZnBUD24WvKibBpVkhWqvAhboxyEs8ZeasYvv';

// Convert keys from Base58 to Uint8Array
const recipientPublicKey = bs58.decode(recipientPublicKeyBase58);
const recipientPrivateKey = bs58.decode(recipientPrivateKeyBase58);

// Convert the recipient's Ed25519 private key to X25519
const x25519RecipientPrivateKey = ed25519ToX25519(recipientPrivateKey);

// Convert the recipient's Ed25519 public key to X25519
const x25519RecipientPublicKey = ed25519PublicToX25519Public(recipientPublicKey);

// Generate an X25519 key pair from the secret key
const recipientKeyPair = nacl.box.keyPair.fromSecretKey(x25519RecipientPrivateKey);

// Example message to encrypt
const message = 'Hello, this is a secret message!';

// Encrypt the message using the recipient's public key
const nonce = nacl.randomBytes(nacl.box.nonceLength);
const ephemeralKeyPair = nacl.box.keyPair();
const sharedSecret = nacl.box.before(x25519RecipientPublicKey, ephemeralKeyPair.secretKey);
const encryptedMessage = nacl.box.after(naclUtil.decodeUTF8(message), nonce, sharedSecret);

const encryptedMessageBase64 = naclUtil.encodeBase64(encryptedMessage);
const nonceBase64 = naclUtil.encodeBase64(nonce);

console.log('Encrypted message:', encryptedMessageBase64);
console.log('Nonce:', nonceBase64);
console.log('Ephemeral Public Key (Base58):', bs58.encode(ephemeralKeyPair.publicKey));

// Decrypt the message using the recipient's private key
const decryptSharedSecret = nacl.box.before(ephemeralKeyPair.publicKey, recipientKeyPair.secretKey);
const decryptedMessage = nacl.box.open.after(encryptedMessage, nonce, decryptSharedSecret);

if (decryptedMessage) {
  console.log('Decrypted message:', naclUtil.encodeUTF8(decryptedMessage));
} else {
  console.log('Failed to decrypt the message');
}
