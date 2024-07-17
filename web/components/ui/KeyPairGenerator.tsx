import React, { useState } from 'react';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';

export default function KeyPairGenerator() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);

  const generateKeyPair = () => {
    const keyPair = nacl.box.keyPair();
    setPublicKey(naclUtil.encodeBase64(keyPair.publicKey));
    setPrivateKey(naclUtil.encodeBase64(keyPair.secretKey));
  };

  return (
    <div className="keypair-generator">
      <button onClick={generateKeyPair} className="btn btn-primary">Create Your Own Key Pairs</button>
      {publicKey && privateKey && (
        <div className="mt-4">
          <p><strong>Public Key:</strong> {publicKey}</p>
          <p><strong>Private Key:</strong> {privateKey}</p>
        </div>
      )}
    </div>
  );
}

