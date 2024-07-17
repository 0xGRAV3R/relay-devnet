'use client';

import { AppHero } from '../ui/ui-layout';
import KeyPairGenerator from '../ui/KeyPairGenerator'; // Import the KeyPairGenerator component

const links: { label: string; href: string }[] = [
  { label: 'Solana Docs', href: 'https://docs.solana.com/' },
  { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
  { label: 'Solana Cookbook', href: 'https://solanacookbook.com/' },
  { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
  {
    label: 'Solana Developers GitHub',
    href: 'https://github.com/solana-developers/',
  },
];

export default function DashboardFeature() {
  return (
    <div>
      <AppHero title="gm 💬✨" subtitle="Say hi to Relay - a Solana Messenger dApp." />
      <center>
        <strong>
          <em>
            <a href="/relay">Click here to enter <u>RELAY</u> dapp</a>
          </em>
        </strong>
        </center>
      <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
        <div className="space-y-2">
          <p>Here are some helpful links to get you started.</p>
          {links.map((link, index) => (
            <div key={index}>
              <a
                href={link.href}
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            </div>
          ))}
        </div>
        <div className="max-w-xl mx-auto py-6 sm:px-6 lg:px-8 text-center">
          <KeyPairGenerator /> {/* Add the KeyPairGenerator component here */}
        </div>
      </div>
    </div>
  );
}
