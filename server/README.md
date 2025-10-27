# Baseflow Tasks Server

Backend API server for BaseConnect, built with Node.js, Express, and MongoDB.

## Features

- RESTful API endpoints for task management
- MongoDB integration
- Wallet verification
- Smart contract integration

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB
- npm or yarn

### Installation

1. Clone the repository and navigate to the server directory:
```bash
cd server
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

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The server will be available at http://localhost:3000

## Environment Variables

Create a `.env` file with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/baseflow-tasks
NODE_ENV=development
JWT_SECRET=your_jwt_secret
CONTRACT_ADDRESS=your_contract_address
RPC_URL=your_rpc_url
CLIENT_URL=
```

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middleware/     # Custom middleware
├── models/         # Database models
└── routes/         # API routes
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot-reload
- `npm test` - Run tests