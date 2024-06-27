import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Relay } from '../target/types/relay';

describe('relay', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Relay as Program<Relay>;

  const relayKeypair = Keypair.generate();

  it('Initialize Relay', async () => {
    await program.methods
      .initialize()
      .accounts({
        relay: relayKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([relayKeypair])
      .rpc();

    const currentCount = await program.account.relay.fetch(
      relayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Relay', async () => {
    await program.methods
      .increment()
      .accounts({ relay: relayKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.relay.fetch(
      relayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Relay Again', async () => {
    await program.methods
      .increment()
      .accounts({ relay: relayKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.relay.fetch(
      relayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Relay', async () => {
    await program.methods
      .decrement()
      .accounts({ relay: relayKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.relay.fetch(
      relayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set relay value', async () => {
    await program.methods
      .set(42)
      .accounts({ relay: relayKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.relay.fetch(
      relayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the relay account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        relay: relayKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.relay.fetchNullable(
      relayKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
