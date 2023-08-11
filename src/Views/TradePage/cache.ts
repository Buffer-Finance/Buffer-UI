import { Wallet } from 'ethers';
import { PrivateKeyAccount } from 'viem';
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
