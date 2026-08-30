import { createPublicClient, createWalletClient, http, type Chain } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}` || '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
const account = privateKeyToAccount(PRIVATE_KEY);

const sepoliaChain: Chain = {
  id: 11155111,
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.sepolia.org'] } },
};

const localhostChain: Chain = {
  id: 1337,
  name: 'Hardhat Local',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: { default: { http: ['http://127.0.0.1:8545'] } },
};

export const getPublicClient = () => {
  const PROVIDER_URL = process.env.PROVIDER_URL || 'https://rpc.sepolia.org';
  return createPublicClient({
    chain: sepoliaChain,
    transport: http(PROVIDER_URL),
  });
};

export const getWalletClient = () => {
  const PROVIDER_URL = process.env.PROVIDER_URL || 'https://rpc.sepolia.org';
  return createWalletClient({
    chain: sepoliaChain,
    transport: http(PROVIDER_URL),
    account,
  });
};

export const getLocalWalletClient = () => {
  return createWalletClient({
    chain: localhostChain,
    transport: http('http://127.0.0.1:8545'),
    account,
  });
};