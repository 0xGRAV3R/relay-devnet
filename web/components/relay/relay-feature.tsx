'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import { AppHero, ellipsify } from '../ui/ui-layout';
import { ExplorerLink } from '../cluster/cluster-ui';
import { useRelayProgram } from './relay-data-access';
import { RelayCreate, RelayList } from './relay-ui';

export default function RelayFeature() {
  const { publicKey } = useWallet();
  const { programId } = useRelayProgram();

  return publicKey ? (
    <div>
      
      <AppHero
        
        title=""
        subtitle={
          ''
        }
        
      >



      {/* Added Modal */} 

      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button className="btn btn-outline btn-accent" onClick={()=>(document.getElementById('send_message_modal') as HTMLDialogElement).showModal()}>💬 Send Message</button>
      <dialog id="send_message_modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Relay - Solana Messenger</h3>
          <p className="p-2 text-xs">Send your message here! <br />Press ESC key to close<br />
          <ExplorerLink
                        path={`account/${programId}`}
                        label={ellipsify(programId.toString())}
                      />
          </p>

          <RelayCreate />
          
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      {/* Added Modal */} 

      </AppHero>
      <RelayList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-[64px]">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  );
}
