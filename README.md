# BaseConnect

A decentralized task management platform built with React, Node.js, and Solidity.

## Project Structure

The project is organized as a monorepo with three main components:

```
├── client/            # Frontend React application
├── server/            # Backend Node.js + Express API
└── contracts/         # Solidity smart contracts
```

### Client (Frontend)

React application with Vite and Shadcn UI components. Handles user interface and wallet integration.

- React + TypeScript
- Vite
- RainbowKit for wallet connection
- Shadcn UI components
- React Query for data fetching

### Server (Backend)

Express.js server providing RESTful API endpoints and blockchain integration.

- Node.js + Express
- MongoDB for data persistence
- JWT authentication
- Smart contract interaction via ethers.js

### Smart Contracts

Solidity smart contracts managing task creation, assignment, and rewards.

- Solidity
- Hardhat development environment
- OpenZeppelin contracts
- Comprehensive test suite

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB
- npm or yarn
- MetaMask or another Web3 wallet

### Installation

1. Clone the repository:
```bash
git clone https://github.com/OkechukwuMiracle/baseconnect.git
cd baseconnect
```

2. Install dependencies for each component:
```bash
# Client
cd client && npm install
cd ..

# Server
cd server && npm install
cd ..

# Smart Contracts
cd contracts && npm install
cd ..
```

3. Set up environment variables:
```bash
# Client
cp client/.env.example client/.env

# Server
cp server/.env.example server/.env

# Smart Contracts
cp contracts/.env.example contracts/.env
```

4. Start the development environment:

In separate terminals:

```bash
# Start the frontend
cd client && npm run dev

# Start the backend
cd server && npm run dev

# Deploy contracts (if needed)
cd contracts && npm run deploy
```

## Development Workflow

1. Start by deploying the smart contracts to your chosen network
2. Update the contract address in the server's .env file
3. Start the backend server
4. Start the frontend application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
