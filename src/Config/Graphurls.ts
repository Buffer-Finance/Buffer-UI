import { isTestnet } from '@Views/TradePage/config';

export const ABGraph =
  import.meta.env.VITE_ENV.toLowerCase() === 'testnet'
    ? 'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/above-below-sepolia/api'
    : 'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.6-arbitrum-one/version/v0.0.8-ab-usdc-pool/api';
