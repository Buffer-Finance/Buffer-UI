import { useAtom, atom, useSetAtom, useAtomValue } from 'jotai';
import {
  BiconomySmartAccountV2,
  BuildUserOpOptions,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from '@biconomy/account';
import { ChainId, Transaction, UserOperation } from '@biconomy/core-types';
import { Bundler, IBundler } from '@biconomy/bundler';
import {
  IPaymaster,
  BiconomyPaymaster,
  PaymasterMode,
} from '@biconomy/paymaster';
import { useAccount, useWalletClient } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
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
import { getSessionSigner, smartAccountAtom } from './useSmartAccount';
export type SmartAccount = {
  library: BiconomySmartAccountV2;
  address: `0x${string}`;
};

// yet to deploy
export const SessionValidationModuleAddress =
  '0x6140708e157f695c77a00a47Ef112aA0913F76B5';
const useUserOp = (
  transaction: Transaction
): { sendTxn: () => Promise<void> } => {
  let smartAccount = useAtomValue(smartAccountAtom);
  const [userOp, setUserOp] = useState<null | {
    userOp: Partial<UserOperation>;
    sessionParams: {
      sessionSigner: ethers.Wallet;
      sessionValidationModule: string;
    };
  }>(null);

  const [sessionSigner, setSessionSigner] = useState<string | null>(
    smartAccount?.address ? getSessionSigner(smartAccount?.address) : null
  );

  useEffect(() => {
    // sync userOp
    const syncUserOp = async () => {
      // console.log(`transaction: `, transaction);
      if (!smartAccount) return;
      const localSigner = getSessionSigner(smartAccount?.address);
      if (!localSigner) return;
      setSessionSigner(localSigner);
      const sessionSigner = new ethers.Wallet(localSigner);
      const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: smartAccount.address,
      });
      smartAccount.library =
        smartAccount.library.setActiveValidationModule(sessionModule);
      const sessionParams = {
        sessionSigner,
        sessionValidationModule: SessionValidationModuleAddress,
      };
      console.log(`transaction: `, transaction);
      let userOps = await smartAccount.library.buildUserOp([transaction], {
        params: sessionParams,
        paymasterServiceData: {
          mode: PaymasterMode.SPONSORED,
        },
      });
      setUserOp({ userOp: userOps, sessionParams });
    };
    syncUserOp();
  }, [transaction.data, smartAccount]);
  //   const
  const sendTxn = useCallback(async () => {
    if (!smartAccount || !userOp?.userOp || !userOp.sessionParams) return;
    const userOpsResponse = await smartAccount.library.sendUserOp(
      userOp?.userOp,
      userOp.sessionParams
    );
    console.timeEnd('useSmartAccount sending-time');

    console.log(`3 useSmartAccount-userOpsResponse: `, userOpsResponse);
    // if (buildParams.params?.batchSessionParams?.length) {

    //   smartWallet = smartWallet.setActiveValidationModule(
    //     smartWallet.defaultValidationModule
    //   );
    // }
    console.time('useSmartAccount waiting-time');

    const fulfiledOrRejected = await userOpsResponse.wait(1);
    console.timeEnd('useSmartAccount waiting-time');

    console.log(`4 useSmartAccount-fulfiledOrRejected: `, fulfiledOrRejected);

    return;
  }, [smartAccount, userOp]);
  return { sendTxn };
};

export { useUserOp };
