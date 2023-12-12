import { useAtom, atom, useSetAtom, useAtomValue } from 'jotai';
import {
  BiconomySmartAccountV2,
  BuildUserOpOptions,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account';
import {
  ChainId,
  SmartAccountType,
  Transaction,
  UserOperation,
} from '@biconomy/core-types';
import { Bundler, IBundler, GasFeeValues } from '@biconomy/bundler';
import {
  IPaymaster,
  BiconomyPaymaster,
  PaymasterMode,
} from '@biconomy/paymaster';
import SCAbi from './SA.json';
import { useAccount, useWalletClient } from 'wagmi';
import { useCallback, useEffect } from 'react';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { BigNumber, ethers } from 'ethers';
import { SponsorUserOperationDto, IHybridPaymaster } from '@biconomy/paymaster';

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
import { encodeFunctionData } from 'viem';
import { GetContractInstanceDto, getSAProxyContract } from '@biconomy/common';
import { JsonRpcProvider } from '@ethersproject/providers';
export type SmartAccount = {
  library: BiconomySmartAccountV2;
  address: `0x${string}`;
};
const smartAccountAtom = atom<SmartAccount | null>(null);
const bundler: IBundler = new Bundler({
  bundlerUrl: `https://bundler.biconomy.io/api/v2/${ChainId.ARBITRUM_GOERLI_TESTNET}/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44`,
  chainId: ChainId.ARBITRUM_GOERLI_TESTNET,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    'https://paymaster.biconomy.io/api/v1/421613/fKY3jOUvS.506cdd32-bd07-441b-963b-c6d44a8e12ff',
});
const signerStorageKey = 'buffer-signer-stable-v2';

export const getSessionSigner = (smartWalletAddress: `0x${string}`) => {
  return window.localStorage.getItem(smartWalletAddress + signerStorageKey);
};
export const setSessionSigner = (
  smartWalletAddress: `0x${string}`,
  pk: string
) => {
  return window.localStorage.setItem(smartWalletAddress + signerStorageKey, pk);
};
const sessionSignerStatusCache: Partial<{ [key: string]: any[] }> = {};

// error handled, took around 2 second to finish
const getSessionState = async (smartWallet: SmartAccount) => {
  if (!(smartWallet.address in sessionSignerStatusCache)) {
    const [isSessionModuleEnabledResult, isBSMEnabledResult] =
      await Promise.allSettled(
        [
          DEFAULT_SESSION_KEY_MANAGER_MODULE,
          DEFAULT_BATCHED_SESSION_ROUTER_MODULE,
        ].map((module) => {
          return smartWallet.library.isModuleEnabled(module);
        })
      );
    sessionSignerStatusCache[smartWallet.address] = [
      isSessionModuleEnabledResult.status == 'fulfilled' &&
        isSessionModuleEnabledResult.value,
      isBSMEnabledResult.status == 'fulfilled' && isBSMEnabledResult.value,
    ];
  }
  return sessionSignerStatusCache[smartWallet.address];
};
// yet to deploy
export const SessionValidationModuleAddress =
  '0x6140708e157f695c77a00a47Ef112aA0913F76B5';
const useSmartAccount = () => {
  const setSmartWallet = useSetAtom(smartAccountAtom);
  let smartAccount = useAtomValue(smartAccountAtom);
  // console.log(`useSmartAccount-smartAccount: `, smartAccount?.address);
  const { data: walletClient } = useWalletClient();
  const updateCache = (sa: SmartAccount) => {
    getSessionState(sa);
  };
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
      const swAddress =
        (await biconomySmartAccount.getAccountAddress()) as `0x${string}`;
      const sa = { library: biconomySmartAccount, address: swAddress };
      updateCache(sa);
      setSmartWallet(sa);
    };
    generateWalletClient();
  }, [walletClient]);

  const sendTxn = useCallback(
    async (transactions: Transaction[], buildOps?: Partial<UserOperation>) => {
      console.time('session');
      console.time('first-line');
      if (!smartAccount) return;
      const sessionResponse = await getSessionState(smartAccount);
      if (!sessionResponse) {
        return;
      }
      const [isSessionEnabled, isBSMEnabled] = sessionResponse;
      let transactionArray = [...transactions];
      console.timeEnd('session');

      const localSigner = await getSessionSigner(smartAccount.address);
      const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: smartAccount.address,
      });
      const batchedSessionModule = await BatchedSessionRouterModule.create({
        moduleAddress: DEFAULT_BATCHED_SESSION_ROUTER_MODULE,
        sessionKeyManagerModule: sessionModule,
        smartAccountAddress: smartAccount.address,
      });
      let buildParams: BuildUserOpOptions = {
        paymasterServiceData: {
          mode: PaymasterMode.SPONSORED,
        },
        skipBundlerGasEstimation: true,
      };
      let sendUserParams: SendUserOpParams | undefined = undefined;
      console.log(
        `1 useSmartAccount-initial-transactionArray: `,
        transactionArray,
        localSigner,
        isSessionEnabled,
        isBSMEnabled
      );
      if (localSigner && isSessionEnabled && isBSMEnabled) {
        // batched sessions transaction

        const sessionSigner = new ethers.Wallet(localSigner);
        if (transactionArray.length == 1) {
          // Single txn sessions
          smartAccount.library =
            smartAccount.library.setActiveValidationModule(sessionModule);
          const sessionParams = {
            sessionSigner,
            sessionValidationModule: SessionValidationModuleAddress,
          };
          console.log(`Sigle Session txn `);
          buildParams['params'] = sessionParams;
          sendUserParams = sessionParams;
        } else {
          // Batched Sesions
          smartAccount.library =
            smartAccount.library.setActiveValidationModule(
              batchedSessionModule
            );
          const sessionparams = transactions.map((d) => {
            return {
              sessionSigner: sessionSigner,
              sessionValidationModule: SessionValidationModuleAddress,
            };
          });
          console.log(`Batched Session txn `);
          const batchSessionParams = { batchSessionParams: sessionparams };
          buildParams['params'] = batchSessionParams;
          sendUserParams = batchSessionParams;
        }
      } else {
        // non batched sessions transaction where mainEOA needs to sign

        const sessionSigner = ethers.Wallet.createRandom();
        const sessionKeyEOA = await sessionSigner.getAddress();
        console.log('sessionKeyEOA', sessionKeyEOA);
        // BREWARE JUST FOR DEMO: update local storage with session key
        setSessionSigner(smartAccount.address, sessionSigner.privateKey);
        // cretae session key data
        const sessionKeyData = defaultAbiCoder.encode(
          ['address', 'address'],
          [
            sessionKeyEOA,
            SessionValidationModuleAddress, // erc20 token address
          ]
        );
        smartAccount.library = smartAccount.library.setActiveValidationModule(
          smartAccount.library.defaultValidationModule
        );
        let sessionTransactionArray = [];
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
        sessionTransactionArray.push(setSessiontrx);
        if (!isSessionEnabled) {
          const enableModuleTrx =
            await smartAccount.library.getEnableModuleData(
              DEFAULT_SESSION_KEY_MANAGER_MODULE
            );
          sessionTransactionArray.push(enableModuleTrx);
        }
        if (!isBSMEnabled) {
          const enableModuleTrx =
            await smartAccount.library.getEnableModuleData(
              DEFAULT_BATCHED_SESSION_ROUTER_MODULE
            );
          sessionTransactionArray.push(enableModuleTrx);
        }
        console.log(`Sesion Creation Txn `, sessionTransactionArray);
        transactionArray = [...transactionArray, ...sessionTransactionArray];
      }
      console.log(
        `2 useSmartAccount-transactionArray: `,
        transactionArray,
        buildParams
      );

      console.timeEnd('first-line');
      let userOp;
      if (!buildOps || transactionArray.length > 1) {
        userOp = await smartAccount.library.buildUserOp(
          transactionArray,
          buildParams
        );
      } else {
        const econdedCallData = encodeFunctionData({
          abi: SCAbi,
          functionName: 'execute_ncC',
          args: [transactions[0].to, 0n, transactionArray[0].data],
        });
        userOp = buildOps;

        const finalUserOp = { ...userOp };
        finalUserOp.callData = econdedCallData;
        console.time('actual-time');
        const {
          callGasLimit,
          verificationGasLimit,
          preVerificationGas,
          paymasterAndData,
        } = await (
          paymaster as IHybridPaymaster<SponsorUserOperationDto>
        ).getPaymasterAndData(finalUserOp, buildParams.paymasterServiceData);
        finalUserOp.verificationGasLimit =
          verificationGasLimit ?? userOp.verificationGasLimit;
        finalUserOp.callGasLimit = callGasLimit ?? userOp.callGasLimit;
        finalUserOp.preVerificationGas =
          preVerificationGas ?? userOp.preVerificationGas;
        finalUserOp.paymasterAndData =
          paymasterAndData ?? userOp.paymasterAndData;
      }

      const userOpsResponse = await smartAccount.library.sendUserOp(
        userOp,
        sendUserParams
      );
      console.log(`3 useSmartAccount-userOpsResponse: `, userOpsResponse);

      const fulfiledOrRejected = await userOpsResponse.wait(1);
      console.log(`4 useSmartAccount-fulfiledOrRejected: `, fulfiledOrRejected);
      console.timeEnd('actual-time');

      return fulfiledOrRejected;
    },
    [smartAccount]
  );
  const customUserOp = async ({
    gasFeeValues,
    nonce,
  }: {
    gasFeeValues: GasFeeValues;
    nonce: BigNumber | undefined;
  }) => {
    if (!smartAccount?.address || !smartAccount.library.paymaster) {
      return;
    }
    const callData = encodeFunctionData({
      abi: SCAbi,
      functionName: 'execute_ncC',
      args: [
        '0x06eFE941603876Cc3Ff0fa980BACE6DdDE9700B6',
        0n,
        '0xd88349630000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000000000000000003840000000000000000000000000000000000000000000000000000000000000001000000000000000000000000df860a06e2c52b33f5e7307e50e280c785b0ecd8000000000000000000000000000000000000000000000000000003d786525e6f000000000000000000000000000000000000000000000000000000000000000500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008',
      ],
    });
    const partialUserOps: Partial<UserOperation> = {
      nonce,
      callData,
      sender: smartAccount?.address,
      initCode: '0x',
      maxFeePerGas: gasFeeValues.maxFeePerGas || undefined,
      maxPriorityFeePerGas: gasFeeValues.maxPriorityFeePerGas || undefined,
    };
    const {
      callGasLimit,
      verificationGasLimit,
      preVerificationGas,
      paymasterAndData,
    } = await (
      paymaster as IHybridPaymaster<SponsorUserOperationDto>
    ).getPaymasterAndData(partialUserOps, {
      mode: PaymasterMode.SPONSORED,
    });
    let finalUserOp = { ...partialUserOps };
    finalUserOp.verificationGasLimit = verificationGasLimit;
    finalUserOp.callGasLimit = callGasLimit;
    finalUserOp.preVerificationGas = preVerificationGas;
    finalUserOp.paymasterAndData = paymasterAndData;
    console.log(`useSmartAccount-finalUserOp: `, finalUserOp);
  };
  return { smartAccount, sendTxn, customUserOp };
};

const getGasFeeValue = async (): Promise<GasFeeValues> => {
  return await bundler.getGasFeeValues();
};

const sa2sm: Partial<{ [key: string]: any }> = {};
const getSessionModule = async (
  smartAccount: SmartAccount
): Promise<SessionKeyManagerModule> => {
  if (!(smartAccount.address in sa2sm)) {
    sa2sm[smartAccount.address] = await SessionKeyManagerModule.create({
      moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
      smartAccountAddress: smartAccount.address,
    });
  }
  return sa2sm[smartAccount.address];
};
const getSessionParams = async (smartAccount: SmartAccount): any => {
  const localSigner = await getSessionSigner(smartAccount.address);
  if (!localSigner) return null;
  const sessionSigner = new ethers.Wallet(localSigner);
  const sessionModule = await getSessionModule(smartAccount);
  const activeModule = smartAccount.library.activeValidationModule;
  console.log(`useSmartAccount-activeModule: `, activeModule);
  // Single txn sessions
  smartAccount.library =
    smartAccount.library.setActiveValidationModule(sessionModule);
  const activeModule2 = smartAccount.library.activeValidationModule;
  console.log(`useSmartAccount-activeModule: `, activeModule2);
  const sessionParams = {
    sessionSigner,
    sessionValidationModule: SessionValidationModuleAddress,
  };
  return { params: sessionParams };
};
export { useSmartAccount, getGasFeeValue, getSessionParams };
