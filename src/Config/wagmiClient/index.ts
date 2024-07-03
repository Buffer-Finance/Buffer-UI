import { getHashUrlQueryParam } from '@Utils/getHashUrlQueryParam';
import { inIframe } from '@Utils/isInIframe';
import { getAllChains, getSupportedChains } from './getConfigChains';
import { getWallets } from './getWallets';
export const urlSettings = getHashUrlQueryParam(window.location.href);

export const getChains = () => getAllChains();
