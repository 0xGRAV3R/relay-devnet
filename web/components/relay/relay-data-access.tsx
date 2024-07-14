'use client';

import { RelayIDL } from '@relay/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';



// Define the interface for the relay entry state
interface RelayEntryState {
  owner: PublicKey;
  title: string;
  message: string;
  recipient: string;
  enc: boolean;
}


interface CreateEntryArgs {
  title: string;
  message: string;
  owner: PublicKey;
  recipient: string;
  enc: boolean;

}

export function useRelayProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = new PublicKey("5ZeMSd6ot2FPBBAt1s4hF3ffKAjNvp1LvFNT62FPqQCi");
  // const programId = new PublicKey("KBScsXsbBp8cTgzkML8bFRvoYb5E3fRGpxxsaU4hzRz");
  // const programId = new PublicKey("DBPA83yqVRDspVi2sXGWPQbFR4AwuBpFZY79GyKHb53N");
  const program = new Program(RelayIDL, programId, provider);
  // let program;

  // try {
  //   program = new Program(RelayIDL, programId, provider);
  // } catch (error) {
  //   console.error("Failed to initialize program:", error);
  //   return { instructions: [] };
  // }

  // if (!program) {
  //   console.error("Program is not defined");
  //   return { instructions: [] };
  // }

  const accounts = useQuery({
    queryKey: ['relay', 'all', { cluster }],
    queryFn: () => program.account.relayEntryState.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['relayEntry', 'create', { cluster }],
    mutationFn: async ({ title, message, owner, recipient, enc }) => {
      const [relayEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        programId
      );
  
      return program.methods
        .createRelayEntry(title, message,  recipient, enc)
        .accounts({
          relayEntry: relayEntryAddress,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to create relay entry: ${error.message}`);
    },
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry,
  };
}

export function useRelayProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useRelayProgram();
  const programId = new PublicKey("8sddtWW1q7fwzspAfZj4zNpeQjpvmD3EeCCEfnc3JnuP");

  const accountQuery = useQuery({
    queryKey: ['relay', 'fetch', { cluster, account }],
    queryFn: () => program.account.relayEntryState.fetch(account),
  });

  const updateEntry = useMutation<string, Error, CreateEntryArgs>({
    mutationKey: ['relayEntry', 'update', { cluster }],
    mutationFn: async ({ title, message, owner, recipient, enc }) => {
      const [relayEntryAddress] = await PublicKey.findProgramAddress(
        [Buffer.from(title), owner.toBuffer()],
        programId
      );
  
      return program.methods
        .updateRelayEntry(title, message, recipient, enc)
        .accounts({
          relayEntry: relayEntryAddress,
        })
        .rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: (error) => {
      toast.error(`Failed to update relay entry: ${error.message}`);
    },
  });

  const deleteEntry = useMutation({
    mutationKey: ['relay', 'deleteEntry', { cluster, account }],
    mutationFn: (title: string) =>
      program.methods.deleteRelayEntry(title).accounts({ relayEntry: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx);
      return accounts.refetch();
    },
  });

  return {
    accountQuery,
    updateEntry, 
    deleteEntry
  };
}
