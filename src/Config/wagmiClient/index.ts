import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { inIframe } from '@Utils/isInIframe';
import { getAllChains, getSupportedChains } from './getConfigChains';
import { getWallets } from './getWallets';
import { allChains } from '@/main';
export const urlSettings = getHashUrlQueryParam(window.location.href);

export const getChains = () => allChains;
