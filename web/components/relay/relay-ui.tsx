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
import { useState } from 'react';

// comment

export function RelayCreate() {
  const { createEntry } = useRelayProgram();
  const { publicKey } = useWallet();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const isFormValid = title.trim() !== '' && message.trim() !== '';

  const handleSubmit = () => {
    if (publicKey && isFormValid) {
      createEntry.mutateAsync({ title, message, owner: publicKey });
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
  const { publicKey } = useWallet();
  const [message, setMessage] = useState('');
  const title = accountQuery.data?.title; 

  const isFormValid = message.trim() !== '';

  const handleSubmit = () => {
    if (publicKey && isFormValid && title) {
      updateEntry.mutateAsync({ title, message, owner: publicKey });
    }
  };

  if (!publicKey){
    return <p>Connect your wallet</p>
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <div className="chat chat-start">
    {/*<div className="card card-bordered border-base-300 border-2 text-neutral-content">*/}  
      {/*<div className="card-body p-8">*/}
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
          {accountQuery.data?.message}
          </p>
          </div>
          {/*<div className="card-actions justify-around">
            <textarea
              placeholder="Update message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="textarea textarea-bordered w-full max-w-xs"
            />
            <button
              className="btn btn-xs lg:btn-md btn-primary"
              onClick={handleSubmit}
              disabled={updateEntry.isPending || !isFormValid}
            >
              Update Message Entry {updateEntry.isPending && '...'}
            </button>
          </div>*/}
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
    </div>
  );
}
