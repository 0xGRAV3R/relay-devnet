# Relay - Solana Messenger dApp 
This is an example of an on-chain decentralized Messaging dapp. This example is a relay chat dapp where you can create, read, update, and delete messaging entries on the solana blockchain and interact with the solana program via a UI. Please note that this only works with Anchor version 0.29.0 for now 🥺.

Test it out here: [https://relay-devnet.vercel.app](https://relay-devnet.vercel.app)

## Getting Started

### Prerequisites

- Node v18.18.0 or higher
- Rust v1.70.0 or higher
- **Anchor CLI 0.29.0 only for now** 
- Solana CLI 1.18.6 or higher

### Installation

#### Clone repo

```shell
git clone <repo-url>
git clone https://github.com/0xGRAV3R/relay-devnet

cd <repo-url>
cd relay-devnet

#### Install dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### Anchor

This is a Solana program written in Rust using the Anchor framework.

Note: The solana program code for the relay dapp can be found in `anchor/programs/src/lib.rs`

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/counter-exports.ts` to match the new program id. For this version, you can cd anchor first to get to anchor directory.

```shell
anchor keys sync 
npm run anchor keys sync
```

#### Build the program:

```shell
anchor build
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
anchor deploy --provider.cluster testnet
(or)
anchor deploy --provider.cluster devnet
npm run anchor deploy --provider.cluster devnet
```

### Web

This is a React app that uses the Anchor generated client to interact with the Solana program. You can cd to root or cd ..

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```
