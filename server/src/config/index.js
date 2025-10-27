import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  environment: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  contractAddress: process.env.CONTRACT_ADDRESS,
  rpcUrl: process.env.RPC_URL,
  clientUrl: process.env.CLIENT_URL || "http://localhost:8080",
};