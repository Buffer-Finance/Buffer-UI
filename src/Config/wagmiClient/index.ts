import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { inIframe } from '@Utils/isInIframe';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { getAllChains, getSupportedChains } from './getConfigChains';
import { getWallets } from './getWallets';
export const urlSettings = getHashUrlQueryParam(window.location.href);

export const getChains = () => getAllChains();
const isTestEnv = import.meta.env.VITE_MODE == 'test';

const { chains, publicClient } = configureChains(getSupportedChains(), [
  publicProvider(),
]);

const connectors = connectorsForWallets(getWallets(getSupportedChains()));

const wagmiClient = createConfig({
  autoConnect: inIframe() ? false : true,
  connectors,
  publicClient,
});

export { chains };
export default wagmiClient;
