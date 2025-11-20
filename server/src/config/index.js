import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  environment: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  serverUrl: process.env.SERVER_URL || "http://localhost:3000",
  contractAddress: process.env.CONTRACT_ADDRESS,
  rpcUrl: process.env.RPC_URL,
  clientUrl: process.env.CLIENT_URL || "http://localhost:8080",
};