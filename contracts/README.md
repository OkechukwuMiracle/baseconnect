# Baseflow Tasks Smart Contracts

Smart contracts for Baseflow Tasks, built with Solidity and Hardhat.

## Features

- Task creation and management
- Native token rewards
- Task assignment and completion verification
- Secure fund management

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository and navigate to the contracts directory:
```bash
cd contracts
```

2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Compile the contracts:
```bash
npm run compile
# or
yarn compile
```

### Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

### Deployment

To deploy to a network:

```bash
npm run deploy
# or
yarn deploy
```

For testnet deployment:

```bash
npm run deploy:testnet
# or
yarn deploy:testnet
```

## Environment Variables

Create a `.env` file with the following variables:

```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
ETHERSCAN_API_KEY=your_etherscan_api_key
REPORT_GAS=true
```

## Contract Architecture

The main contract is `BaseflowTasks.sol` which handles:

- Task creation with rewards
- Task assignment to workers
- Task completion and reward distribution
- Task cancellation
- Status tracking

## Project Structure

```
contracts/           # Smart contract source files
scripts/            # Deployment and auxiliary scripts
test/              # Contract test files
```

## Available Scripts

- `npm run compile` - Compile contracts
- `npm test` - Run tests
- `npm run deploy` - Deploy to local network
- `npm run deploy:testnet` - Deploy to testnet
- `npm run verify` - Verify contracts on Etherscan