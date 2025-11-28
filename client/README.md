# Baseflow Tasks Client

The frontend application for BaseConnect, built with React, Vite, and Shadcn UI.

## Features

- Task creation and management
- Wallet integration using RainbowKit
- Responsive UI with Shadcn components
- Type-safe development with TypeScript

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository and navigate to the client directory:
```bash
cd client
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

The application will be available at http://localhost:8080

### Building for Production

```bash
npm run build
# or
yarn build
```

## Environment Variables

Create a `.env` file with the following variables:

```env
VITE_API_URL=http://localhost:3000
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
```

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions
├── pages/         # Application pages/routes
└── providers/     # Context providers
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint