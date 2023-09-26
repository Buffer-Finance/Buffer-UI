import { PrivateKeyAccount, createWalletClient, custom } from 'viem';
import { Chain } from 'wagmi';

var address2SingatureCache: { [key: string]: string } = {};

export const getSingatureCached = async (
  oneCTWallet: PrivateKeyAccount | null
) => {
  if (!oneCTWallet) return null;
  if (!address2SingatureCache[oneCTWallet.address]) {
    address2SingatureCache[oneCTWallet.address] = await oneCTWallet.signMessage(
      {
        message: import.meta.env.VITE_SIGN_MESSAGE,
      }
    );
  }
  return address2SingatureCache[oneCTWallet.address];
};

export const getSignatureFromAddress = async (
  activeChain: Chain,
  userAddress: `0x${string}`
) => {
  if (!address2SingatureCache[userAddress]) {
    if (!window.ethereum) return null;
    const walletClient = createWalletClient({
      chain: activeChain,
      transport: custom(window.ethereum),
    });

    address2SingatureCache[userAddress] = await walletClient.signMessage({
      account: userAddress,

      message: import.meta.env.VITE_SIGN_MESSAGE,
    });
  }
  return address2SingatureCache[userAddress];
};
