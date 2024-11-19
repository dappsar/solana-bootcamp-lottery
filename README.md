# Solana Simple Lottery

## About This Repo

This **Simple Lottery Game** is built using the Anchor framework on Solana and includes a modern frontend powered by **Next.js**, **TypeScript**, and **Tailwind CSS**. Users can buy lottery tickets by selecting a number between 1 and 75. Once all 25 tickets are sold, the program randomly selects a winner, who can then claim their prize.

Note: "randomly": With a pseudo-random method that creates a seed using a combination of on-chain data and the user's public key.

### Key Features

- **Lottery Initialization**: Begins with 25 tickets, each tied to a unique number (1–75), which are shuffled and stored in the game state.
- **Ticket Purchase**: Users pick a number to purchase a ticket. The program verifies availability, assigns the ticket to the user, and transfers 0.1 SOL from the user to the program.
- **Winner Selection & Game Reset**: Upon selling all tickets, a winner is chosen randomly, and the game resets with a fresh shuffle of ticket numbers.
- **Reward Claim**: The winner can claim their prize (2.5 SOL) by proving ticket ownership.
- **SOL/Lamport Transfers**: Demonstrates Solana's system program for transferring SOL and manual Lamport manipulation.

Live Demo [here](https://solana-s6-lottery.vercel.app/).


### Folders Structure

#### anchor

The _anchor_ folder contains the Solana program written in Rust, built using the Anchor framework.

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### web

The folder "web" contains a NextJs application that uses the Anchor-generated client to interact with the Solana program.

---


## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js v18.18.0+](https://nodejs.org/)
- [Rust v1.77.2+](https://www.rust-lang.org/)
- [Anchor CLI v0.30.1+](https://www.anchor-lang.com/)
- [Solana CLI v1.18.9+](https://docs.solana.com/cli/install-solana-cli-tools)
- [Nx CLI](https://nx.dev)


### Clone the Repository

```bash
git clone <repo-url>
cd <repo-name>
```

### Install Dependencies

```shell
# web
npm install -g nx
npm install

# anchor
cd anchor
npm install
```

### Use with program already deployed in devnet

Just start the web app and switch your wallet to devnet.

```shell
npm run dev
```

If you use Phantom wallet, you have to enable testnet mode. You could get detailed info [here](https://docs.phantom.app/developer-powertools/testnet-mode).


## Deploy to localnet

### Build the program

```shell
npm run anchor-build
```
or

```shell
cd anchor
anchor build
```

### Start the test validator with the program deployed

```shell
npm run anchor-localnet
```

or

```shell
solana config set --url localhost
solana-test-validator
```

### get wallets funds 

```shell
solana airdrop 10
```

### Deploy to localhost

```shell
cd anchor
anchor deploy
```

### Run the tests

```shell
npm run anchor-test
```

### Update program Id

After deploy you have to update del programId in:

- [anchor/Anchor.toml](anchor/Anchor.toml)
- [anchor/src/lottery-exports.ts](anchor/src/lottery-exports.ts)
- [anchor/programs/lottery/src/lib.rs](anchor/programs/lottery/src/lib.rs)
- [anchor/target/idl/lottery.json](anchor/target/idl/lottery.json)
- [anchor/target/types/lottery.ts](anchor/target/types/lottery.ts)

In all that files de program id must match!


### Start the web app

Just start the web app and switch your wallet to localnet.

```shell
npm run dev
```

If you receive an error (in the browser console) indicating that the program ID does not match, ensure that the files mentioned above have the correct program ID. You may also try clearing your browser's local cache or deleting the folders `web/.next`, `anchor/.anchor`, and `anchor/.target`, and then follow the steps outlined above again.

Sometimes, when using Phantom, the wallet may not be properly set to the correct network. Make sure it is connected to the correct network!

Again, if you switch between localnet and devnet without refreshing the site, you might encounter this error. Try pressing `Ctrl+F5` to refresh the browser.


## Deploy to Devnet

The same steps as mentioned above, but change the cluster to devnet.

```shell
cd anchor
anchor deploy --provider.cluster devnet
```

Additionally, after deployment, you need to update the program address in this file within the "getLotteryProgramId" method to the Devnet option (switch):

- [anchor/src/lottery-exports.ts](anchor/src/lottery-exports.ts)


Remember that to use on devnet, you will need funds in your wallet. You can use [the official Solana faucet](https://faucet.solana.com/).

## Build web 

To build the site, simply run (from project root folder):

```shell
npm run build
```

If you encounter the following error:
  _Cannot read properties of null (reading 'message')_ 
  
try running:

```shell
nx reset
```

nx reset clears the local cache and removes any corrupted or outdated state that Nx may have stored. This is particularly useful when encountering unexpected errors related to task scheduling, dependency graph computation, or workspace configurations. Running this command ensures a clean environment, allowing Nx to rebuild its cache and dependency information from scratch.


