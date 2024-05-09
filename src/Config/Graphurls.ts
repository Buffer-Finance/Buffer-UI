import { isTestnet } from '@Views/TradePage/config';

export const ABGraph =
  import.meta.env.VITE_ENV.toLowerCase() === 'testnet'
    ? 'https://buffer-finance-indexer-production-e4ce.up.railway.app/'
    : 'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.6-arbitrum-one/version/v0.0.6-ab-add-usd-values/api';
