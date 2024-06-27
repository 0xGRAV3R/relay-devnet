// Here we export some useful types and functions for interacting with the Anchor program.
import { Cluster, PublicKey } from '@solana/web3.js';
import type { Relay } from '../target/types/relay';
import { IDL as RelayIDL } from '../target/types/relay';

// Re-export the generated IDL and type
export { Relay, RelayIDL };

// After updating your program ID (e.g. after running `anchor keys sync`) update the value below.
export const RELAY_PROGRAM_ID = new PublicKey(
  'EZB64BQPMPzGNEV6XvrxTSPcQHCXaRF7aXMgunxQ6LNh'
);

// This is a helper function to get the program ID for the Relay program depending on the cluster.
export function getRelayProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return RELAY_PROGRAM_ID;
  }
}
