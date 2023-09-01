import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { inIframe } from '@Utils/isInIframe';
import { getWallets } from './getWallets';
import { getAllChains, getSupportedChains } from './getConfigChains';
import { mockConnector } from './mockConnector';
export const urlSettings = getHashUrlQueryParam(window.location.href);

export const getChains = () => getAllChains();

const isTestEnv = import.meta.env.VITE_MODE == 'test';

const { chains, publicClient } = configureChains(getAllChains(), [
  publicProvider(),
]);

const connectors = isTestEnv
  ? mockConnector
  : connectorsForWallets(getWallets(getAllChains()));

const wagmiClient = createConfig({
  autoConnect: inIframe() ? false : true,
  connectors,
  publicClient,
});

export { chains };
export default wagmiClient;
