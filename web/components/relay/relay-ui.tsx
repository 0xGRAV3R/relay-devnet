'use client';

import { Keypair, PublicKey } from '@solana/web3.js';
// import { useMemo } from 'react';
import { ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import {
  useRelayProgram,
  useRelayProgramAccount,
} from './relay-data-access';
import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';

import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import Modal from 'react-modal';

// comment

export function RelayCreate() {
  const { createEntry } = useRelayProgram();
  const { publicKey } = useWallet();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [myKey, setMyKey] = useState(''); // Add myKey state
  const [myPublicKey, setMyPublicKey] = useState(''); // Add myPublicKey state
  const [enc, setEnc] = useState(false);

  const isFormValid = title.trim() !== '' && message.trim() !== '' && recipient.trim() !== '' && myKey.trim() !== '' && myPublicKey.trim() !== '';

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      console.log("recipient", recipient);
      console.log("recipient length", recipient.length);
      const recipientUint8 = naclUtil.decodeBase64(recipient); // Decode recipient pub key from Base64
      const myKeyUint8 = naclUtil.decodeBase64(myKey); // Decode myKey private key from Base64


      let encryptedMessage = message;

      if (enc) {
        const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
        // const keyPair = nacl.box.keyPair();
        // const sharedSecret = nacl.box.before(recipientPubkey.toBuffer(), keyPair.secretKey);
        const sharedSecret = nacl.box.before(recipientUint8, myKeyUint8);

        const encrypted = nacl.box.after(
          naclUtil.decodeUTF8(message),
          nonce,
          sharedSecret
        );

        encryptedMessage = JSON.stringify({
          nonce: naclUtil.encodeBase64(nonce),
          encrypted: naclUtil.encodeBase64(encrypted),
          senderPublicKey: myPublicKey
        });
        console.log("Length of encryptedMessage:", new TextEncoder().encode(encryptedMessage).length);
      }

      console.log("recipient length", recipient.length);
      console.log("title length", title.length);
      console.log("encryptedMessage length", encryptedMessage.length);

      // console.log("enc length", enc.length);
      createEntry.mutateAsync({ title, message: encryptedMessage, owner: publicKey, recipient: recipient, enc });
    }
  };

  if (!publicKey){
    return <p>Connect your wallet</p>
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Address"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered input-xs w-full max-w-xs mb-1"
      />
      
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="textarea textarea-bordered textarea-xs w-full max-w-xs"
      />
      <input
        type="text"
        placeholder="Recipient TweetNacl Public Key"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="input input-bordered input-xs w-full max-w-xs mb-1"
      />
      <input
        type="text"
        placeholder="Your Private Key (Base64) - will NOT be stored"
        value={myKey}
        onChange={(e) => setMyKey(e.target.value)}
        className="input input-bordered input-xs w-full max-w-xs mb-1"
      />
      <input
        type="text"
        placeholder="Your Public Key"
        value={myPublicKey}
        onChange={(e) => setMyPublicKey(e.target.value)}
        className="input input-bordered input-xs w-full max-w-xs mb-1"
      />
      <div className="form-control">
        <label className="cursor-pointer label">
          <span className="label-text">Encrypt</span>
          <input
            type="checkbox"
            checked={enc}
            onChange={(e) => setEnc(e.target.checked)}
            className="checkbox checkbox-primary"
          />
        </label>
      </div>            
      <br></br>
      <button
        className="btn btn-xs sm:btn-sm btn-accent"
        onClick={handleSubmit}
        disabled={createEntry.isPending || !isFormValid}
      >
        Send Message Entry {createEntry.isPending && '...'}
      </button>
    </div>
  );
}


export function RelayList() {
  const { accounts, getProgramAccount } = useRelayProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="flex justify-center alert alert-info">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid gap-4 md:grid-cols-1">
          {accounts.data?.map((account) => (
            <RelayCard
              key={account.publicKey.toString()}
              account={account.publicKey}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  );
}

function RelayCard({ account }: { account: PublicKey }) {
  const {
    accountQuery,
    updateEntry, 
    deleteEntry
  } = useRelayProgramAccount({ account });
  const { publicKey, signMessage } = useWallet();
  const [message, setMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  // const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [privateKey, setPrivateKey] = useState('');
  const [privateKeyInput, setPrivateKeyInput] = useState('');
  const title = accountQuery.data?.title; 
  // const recipient = accountQuery.data?.recipient;
  // const recipient = accountQuery.data?.recipient ? new PublicKey(accountQuery.data.recipient) : undefined;
  const recipient = accountQuery.data?.recipient || ''; // Updated to handle recipient as text
  const enc = accountQuery.data?.enc;
  // const messageData = accountQuery.data?.message ? JSON.parse(accountQuery.data.message) : null;

  const isJSON = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  // const messageData = enc && accountQuery.data?.message && isJSON(accountQuery.data.message)
  //   ? JSON.parse(accountQuery.data.message)
  //   : null;
  const messageData = enc && accountQuery.data?.message && isJSON(accountQuery.data.message)
    ? JSON.parse(accountQuery.data.message)
    : accountQuery.data?.message;

  // const isFormValid = message.trim() !== '';
  const isFormValid = message.trim() !== '' && recipient !== undefined && enc !== undefined;


  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey, recipient, enc });
    }
  };

  // const handleDecrypt = async () => {
  //   const { nonce, encrypted, senderPublicKey } = messageData;
  //   const decrypted = await decryptMessage(encrypted, nonce, senderPublicKey, privateKey);
  //   setDecryptedMessage(decrypted);
  // };

  const handleDecrypt = () => {
    setIsModalOpen(true);
  };

  // // Function to toggle the modal
  // const toggleModal = () => {
  //   setShowModal(!showModal);
  // };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setDecryptedMessage(null);
    setPrivateKeyInput('');
  };

  const handleDecryptMessage = async () => {
    try {
      const messageData = accountQuery.data?.message ? JSON.parse(accountQuery.data.message) : null;
      if (messageData) {
        const decrypted = await decryptMessage(
          messageData.encrypted,
          messageData.nonce,
          messageData.senderPublicKey,
          privateKeyInput
        );
        setDecryptedMessage(decrypted);
      }
    } catch (error) {
      console.error('Failed to decrypt message', error);
      setDecryptedMessage('Failed to decrypt message');
    }
  };  





  if (!publicKey){
    return <p>Connect your wallet</p>
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="chat chat-start">
      <div className="p-2">
        <div className="space-y-2">
          
          <div className="chat-header">
          <p
            /*className="card-title text-2xl cursor-pointer"*/
            className="link text-xs text-accent"
            onClick={() => accountQuery.refetch()}
          >
            {accountQuery.data?.title}
          </p>
          </div>
          
          <div className="chat-bubble">
          <p> 
          {/* {accountQuery.data?.message} */}
          {decryptedMessage || accountQuery.data?.message}
          </p>
          <p>Recipient: {recipient?.toString()}</p> {/* Convert recipient to string */}
          <p>Encrypted: {enc ? 'Yes' : 'No'}</p>
          {enc && (
              <button onClick={handleDecrypt} className="btn btn-xs sm:btn-sm btn-accent">
                Decrypt
              </button>
            )}
          </div>

          <div className="text-left">
          {/* <div className="text-center space-y-4"> */}
            <div className="chat-footer opacity-50">
            <p>
              <ExplorerLink
                className='text-xs link'
                path={`account/${account}`}
                label={ellipsify(account.toString())}
              />
            &nbsp;
            <button
              /*className="btn btn-xs btn-error btn-outline"*/
              className="btn btn-circle btn-outline"
              onClick={() => {
                if (
                  !window.confirm(
                    'Are you sure you want to close this account?'
                  )
                ) {
                  return;
                }
                const title = accountQuery.data?.title;
                if (title) {
                  return deleteEntry.mutateAsync(title);
                }
              }}
              disabled={deleteEntry.isPending}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
              
            </button>
            </p>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose}>
        <h2>Decrypt Message</h2>
        {decryptedMessage ? (
          <div>
            <p>Decrypted Message: {decryptedMessage}</p>
            <button onClick={handleModalClose} className="btn btn-accent">Close</button>
          </div>
        ) : (
          <div>
            {/* <p>Nonce: {accountQuery.data?.message ? JSON.parse(accountQuery.data.message).nonce : ''}</p>
            <p>Encrypted Message: {accountQuery.data?.message ? JSON.parse(accountQuery.data.message).encrypted : ''}</p>
            <p>Sender Public Key: {accountQuery.data?.message ? JSON.parse(accountQuery.data.message).senderPublicKey : ''}</p> */}
            <p>Nonce: {messageData?.nonce}</p>
            <p>Encrypted Message: {messageData?.encrypted}</p>
            <p>Sender Public Key: {messageData?.senderPublicKey}</p>
            <input
              type="text"
              placeholder="Enter your private key"
              value={privateKeyInput}
              onChange={(e) => setPrivateKeyInput(e.target.value)}
              className="input input-bordered input-xs w-full max-w-xs mb-1"
            />
            <button onClick={handleDecryptMessage} className="btn btn-accent">Decrypt</button>
          </div>
        )}
      </Modal>
    </div>
  );
}


async function decryptMessage(
  encrypted: string, 
  nonce: string, 
  senderPublicKey: string, 
  privateKey: string
) {
  // Add your decryption logic here
  const senderPublicKeyUint8 = naclUtil.decodeBase64(senderPublicKey);
  const nonceUint8 = naclUtil.decodeBase64(nonce);
  const privateKeyUint8 = naclUtil.decodeBase64(privateKey);

  
  const sharedSecret = nacl.box.before(senderPublicKeyUint8, privateKeyUint8);
  const encryptedUint8 = naclUtil.decodeBase64(encrypted);

  const decryptedMessage = nacl.box.open.after(encryptedUint8, nonceUint8, sharedSecret);

  // return decrypted ? naclUtil.encodeUTF8(decrypted) : 'Failed to decrypt message';

  if (decryptedMessage) {
    return naclUtil.encodeUTF8(decryptedMessage);
  } else {
    throw new Error('Failed to decrypt the message');
  }
}