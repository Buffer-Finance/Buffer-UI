import { useAtom, atom, useSetAtom, useAtomValue } from 'jotai';
import {
  BiconomySmartAccountV2,
  BuildUserOpOptions,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account';
import { ChainId, Transaction } from '@biconomy/core-types';
import { Bundler, IBundler } from '@biconomy/bundler';
import {
  IPaymaster,
  BiconomyPaymaster,
  PaymasterMode,
} from '@biconomy/paymaster';
import { useAccount, useWalletClient } from 'wagmi';
import { useCallback, useEffect } from 'react';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { ethers } from 'ethers';

import {
  DEFAULT_BATCHED_SESSION_ROUTER_MODULE,
  DEFAULT_SESSION_KEY_MANAGER_MODULE,
  MultiChainValidationModule,
  BatchedSessionRouterModule,
  SessionKeyManagerModule,
  SendUserOpParams,
} from '@biconomy/modules';
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

// error handled, took around 2 second to finish
const getSessionState = async (smartWallet: BiconomySmartAccountV2) => {
  const [isSessionModuleEnabledResult, isBSMEnabledResult] =
    await Promise.allSettled(
      [
        DEFAULT_SESSION_KEY_MANAGER_MODULE,
        DEFAULT_BATCHED_SESSION_ROUTER_MODULE,
      ].map((module) => {
        return smartWallet.isModuleEnabled(module);
      })
    );
  return [
    isSessionModuleEnabledResult.status == 'fulfilled' &&
      isSessionModuleEnabledResult.value,
    isBSMEnabledResult.status == 'fulfilled' && isBSMEnabledResult.value,
  ];
};
// yet to deploy
export const SessionValidationModuleAddress =
  '0x6140708e157f695c77a00a47Ef112aA0913F76B5';
const useSmartWallet = () => {
  const setSmartWallet = useSetAtom(smartWalletAtom);
  let smartWallet = useAtomValue(smartWalletAtom);
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

  const sendTxn = useCallback(
    async (
      transactions: Transaction[],
      config?: { sponsored?: 'Native' | `0x${string}` }
    ) => {
      if (!smartWallet || !smartWalletAddress) return;
      console.time('SessionStart');
      const [isSessionEnabled, isBSMEnabled] = await getSessionState(
        smartWallet
      );
      let transactionArray = [...transactions];

      console.timeEnd('SessionStart');
      console.log(
        `useSmartWallet-isSessionEnabled, isBSMEnabled: `,
        isSessionEnabled,
        isBSMEnabled
      );
      const localSigner = await getSessionSigner(smartWalletAddress);
      const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: smartWalletAddress,
      });
      const batchedSessionModule = await BatchedSessionRouterModule.create({
        moduleAddress: DEFAULT_BATCHED_SESSION_ROUTER_MODULE,
        sessionKeyManagerModule: sessionModule,
        smartAccountAddress: smartWalletAddress,
      });
      const buildParams: BuildUserOpOptions = {
        paymasterServiceData: {
          mode: PaymasterMode.SPONSORED,
        },
      };
      let sendUserParams: SendUserOpParams | undefined = undefined;
      console.log(
        `1 useSmartWallet-prereq: `,
        localSigner,
        isSessionEnabled,
        isBSMEnabled
      );
      if (localSigner && isSessionEnabled && isBSMEnabled) {
        // batched sessions transaction

        const sessionSigner = new ethers.Wallet(localSigner);

        smartWallet =
          smartWallet.setActiveValidationModule(batchedSessionModule);
        const sessionparams = transactions.map((d) => {
          return {
            sessionSigner: sessionSigner,
            sessionValidationModule: SessionValidationModuleAddress,
          };
        });
        const batchSessionParams = { batchSessionParams: sessionparams };
        buildParams['params'] = batchSessionParams;
        sendUserParams = batchSessionParams;
      } else {
        // non batched sessions transaction where mainEOA needs to sign

        if (!localSigner) {
          const sessionSigner = ethers.Wallet.createRandom();
          const sessionKeyEOA = await sessionSigner.getAddress();
          console.log('sessionKeyEOA', sessionKeyEOA);
          // BREWARE JUST FOR DEMO: update local storage with session key
          setSessionSigner(smartWalletAddress, sessionSigner.privateKey);
          // cretae session key data
          const sessionKeyData = defaultAbiCoder.encode(
            ['address', 'address'],
            [
              sessionKeyEOA,
              SessionValidationModuleAddress, // erc20 token address
            ]
          );
          const sessionTxData = await batchedSessionModule.createSessionData([
            {
              validUntil: 0,
              validAfter: 0,
              sessionValidationModule: SessionValidationModuleAddress,
              sessionPublicKey: sessionKeyEOA,
              sessionKeyData: sessionKeyData,
            },
          ]);
          const setSessiontrx = {
            to: DEFAULT_SESSION_KEY_MANAGER_MODULE, // session manager module address
            data: sessionTxData.data,
          };
          transactionArray.push(setSessiontrx);
        }
        if (!isSessionEnabled) {
          const enableModuleTrx = await smartWallet?.getEnableModuleData(
            DEFAULT_SESSION_KEY_MANAGER_MODULE
          );
          transactionArray.push(enableModuleTrx);
        }
        if (!isBSMEnabled) {
          const enableModuleTrx = await smartWallet?.getEnableModuleData(
            DEFAULT_BATCHED_SESSION_ROUTER_MODULE
          );
          transactionArray.push(enableModuleTrx);
        }
      }
      console.log(
        `2 useSmartWallet-transactionArray: `,
        transactionArray,
        buildParams
      );

      let userOps = await smartWallet?.buildUserOp(
        transactionArray,
        buildParams
      );

      const userOpsResponse = await smartWallet?.sendUserOp(
        userOps,
        sendUserParams
      );
      console.log(`3 useSmartWallet-userOpsResponse: `, userOpsResponse);
      // if (buildParams.params?.batchSessionParams?.length) {

      //   smartWallet = smartWallet.setActiveValidationModule(
      //     smartWallet.defaultValidationModule
      //   );
      // }
      const fulfiledOrRejected = await userOpsResponse.wait(1);
      console.log(`4 useSmartWallet-fulfiledOrRejected: `, fulfiledOrRejected);

      return fulfiledOrRejected;
    },
    [smartWallet, smartWalletAddress]
  );
  return { smartWallet, smartWalletAddress, sendTxn };
};

export { useSmartWallet };
