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
        
        title="Relay - Sol Messenger"
        subtitle={
          'Send your message here!'
        }
        
      >
      
      {/* The button to open modal */}
      <label htmlFor="my_modal_7" className="btn">✍️ Send Message</label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_7" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Relay - Sol Messenger</h3>
          <p className="py-4">Send your message here! <br /> Press ESC key to close</p>
          <p className="mb-6">
          <ExplorerLink
            path={`account/${programId}`}
            label={ellipsify(programId.toString())}
          />
          </p>
          <RelayCreate />
        </div>
        <label className="modal-backdrop" htmlFor="my_modal_7">Close</label>
      </div>


      {/* Added Modal */} 
      {/* Open the modal using document.getElementById('ID').showModal() method */}
<button className="btn" onClick={()=>document.getElementById('my_modal_1').showModal()}>open modal</button>
<dialog id="my_modal_1" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Hello!</h3>
    <p className="py-4">Press ESC key or click the button below to close</p>
    <div className="modal-action">
      <form method="dialog">
        {/* if there is a button in form, it will close the modal */}
        <button className="btn">Close</button>
      </form>
    </div>
  </div>
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
