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
      <div className="drawer">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label htmlFor="my-drawer" className="btn btn-primary drawer-button">✍️ Send Message</label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <h3 className="text-lg font-bold">Relay - Sol Messenger</h3>
                <p className="py-4">Send your message here! <br />
            <ExplorerLink
                  path={`account/${programId}`}
                  label={ellipsify(programId.toString())}
                />
                </p>
            <RelayCreate />
          </ul>
        </div>
      </div>    

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
