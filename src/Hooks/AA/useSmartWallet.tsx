import { useAtom, atom, useSetAtom, useAtomValue } from 'jotai';
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account';
import { ChainId } from '@biconomy/core-types';
import { Bundler, IBundler } from '@biconomy/bundler';
import { IPaymaster, BiconomyPaymaster } from '@biconomy/paymaster';
import { useAccount, useWalletClient } from 'wagmi';
import { useEffect } from 'react';
import { MultiChainValidationModule } from '@biconomy/modules';
import { walletClientToSigner } from '@Utils/Web3/walletClientToProvider';
import { arbitrumGoerli } from '@wagmi/chains';
const smartWalletAtom = atom<BiconomySmartAccountV2 | null>(null);
const smartWalletAddressAtom = atom<`0x${string}` | null>(null);
const bundler: IBundler = new Bundler({
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${ChainId.ARBITRUM_GOERLI_TESTNET}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
  chainId: ChainId.ARBITRUM_GOERLI_TESTNET,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    'https://paymaster.biconomy.io/api/v1/421613/fKY3jOUvS.506cdd32-bd07-441b-963b-c6d44a8e12ff',
});

export const getSessionSigner = (smartWalletAddress: `0x${string}`) => {
  return window.localStorage.getItem(smartWalletAddress + 'buffer-signer');
};
export const setSessionSigner = (
  smartWalletAddress: `0x${string}`,
  pk: string
) => {
  return window.localStorage.setItem(smartWalletAddress + 'buffer-signer', pk);
};

// yet to deploy
export const SessionValidationModuleAddress =
  '0x6140708e157f695c77a00a47Ef112aA0913F76B5';
const useSmartWallet = () => {
  const setSmartWallet = useSetAtom(smartWalletAtom);
  const smartWallet = useAtomValue(smartWalletAtom);
  const setSmartWalletAddress = useSetAtom(smartWalletAddressAtom);
  const smartWalletAddress = useAtomValue(smartWalletAddressAtom);
  const { data: walletClient } = useWalletClient();
  useEffect(() => {
    const generateWalletClient = async () => {
      if (!walletClient) return;
      const multiChainModule = await MultiChainValidationModule.create({
        signer: walletClientToSigner(walletClient),
        moduleAddress: '0x000000824dc138db84FD9109fc154bdad332Aa8E',
      });
      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.ARBITRUM_GOERLI_TESTNET,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: multiChainModule,
        activeValidationModule: multiChainModule,
      });
      setSmartWallet(biconomySmartAccount);
      const swAddress = await biconomySmartAccount.getAccountAddress();
      setSmartWalletAddress(swAddress as `0x${string}`);
    };
    generateWalletClient();
  }, [walletClient]);
  return { smartWallet, smartWalletAddress };
};

export { useSmartWallet };
