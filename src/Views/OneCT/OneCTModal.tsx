import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { showOnboardingAnimationAtom } from '@Views/TradePage/atoms';
import { baseUrl } from '@Views/TradePage/config';
import { getWalletFromOneCtPk } from '@Views/TradePage/utils/generateTradeSignature';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { CloseOutlined } from '@mui/icons-material';
import { signTypedData } from '@wagmi/core';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';
import { ModalBase } from 'src/Modals/BaseModal';
import { getAddress, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import { Features } from './Features';
import { isOneCTModalOpenAtom } from './OneCTButton';
import { RegistrationStageCard } from './RegistrationStageCard';
import { TimingBar } from './TimingBar';
import { EIP712Domain, useOneCTWallet } from './useOneCTWallet';

const OneCTModal: React.FC<any> = ({}) => {
  const { address } = useAccount();
  const isModalOpen = useAtomValue(isOneCTModalOpenAtom);
  const setModal = useSetAtom(isOneCTModalOpenAtom);
  const [laoding, setLaoding] = useState(false);
  const { activeChain } = useActiveChain();
  const configData = getConfig(activeChain.id);
  const {
    generatePk,
    oneCtAddress,
    nonce,
    registeredOneCT,
    createLoading,
    oneCtPk,
    shouldStartTimer,
    toatlMiliseconds,
  } = useOneCTWallet();
  const toastify = useToast();
  const setOnboardingAnimation = useSetAtom(showOnboardingAnimationAtom);

  const handleRegister = async () => {
    if (registeredOneCT) {
      return toastify({
        msg: 'You have already registered your 1CT Account. You can start 1CT now!',
        type: 'success',
        id: 'registeredOneCT',
      });
    }
    if (typeof oneCtPk !== 'string')
      return toastify({
        msg: 'Please create your 1CT Account first',
        type: 'error',
        id: 'oneCtPk',
      });

    if (
      !oneCtAddress ||
      !address ||
      nonce === undefined ||
      nonce === null ||
      !activeChain
    )
      return toastify({
        msg: 'Someting went wrong. Please try again later',
        type: 'error',
        id: 'noparams',
      });
    try {
      setLaoding(true);

      const wallet = getWalletFromOneCtPk(oneCtPk);

      const domain = {
        name: 'Validator',
        version: '1',
        chainId: activeChain.id,
        verifyingContract: getAddress(configData.signer_manager),
      } as const;

      const types = {
        EIP712Domain,
        RegisterAccount: [
          { name: 'oneCT', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'nonce', type: 'uint256' },
        ],
      };

      const signature = await signTypedData({
        types,
        domain,
        primaryType: 'RegisterAccount',
        message: {
          oneCT: wallet.address,
          user: address,
          nonce: nonce,
        },
      });

      if (!signature) {
        setLaoding(false);
        return toastify({
          msg: 'User rejected to sign.',
          type: 'error',
          id: 'signature',
        });
      }

      const apiParams = {
        one_ct: wallet.address,
        account: address,
        nonce: nonce,
        registration_signature: signature,
        environment: activeChain.id,
      };

      const resp = await axios.post(baseUrl + 'register/', null, {
        params: apiParams,
      });

      if (resp?.data?.one_ct && resp.data.one_ct !== zeroAddress) {
        setOnboardingAnimation(true);
        setModal(false);
      }
    } catch (e) {
      toastify({
        msg: `Error in register API. please try again later. ${e}`,
        type: 'error',
        id: 'registerapi',
      });
    } finally {
      setLaoding(false);
    }
  };

  return (
    <>
      <ModalBase
        open={isModalOpen}
        onClose={() => setModal((m) => false)}
        className="max-w-[600px] !w-[500px] sm:max-w-full sm:!p-5 !bg-[#232334]"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-[500] text-f20 sm:text-f14">
            Activate your Trading Account
          </h3>
          <button
            className="p-3 sm:p-2 text-1 rounded-full bg-2"
            test-id="close-button"
            onClick={() => setModal((m) => false)}
          >
            <CloseOutlined className="!scale-125 sm:!scale-100" />
          </button>
        </div>

        <div className="flex-col mt-[25px] text-3 text-f14 sm:text-f11 font-[500] ">
          <Features />

          <RegistrationStageCard
            completeName="Created"
            initialName="Create"
            isLoading={createLoading}
            isStepComplete={!!oneCtPk}
            onCLick={
              oneCtPk
                ? () => {
                    toastify({
                      msg: `Already created `,
                      type: 'success',
                      id: 'alreadycreated',
                    });
                  }
                : generatePk
            }
          />

          <RegistrationStageCard
            completeName="Registered"
            initialName="Register"
            isLoading={laoding}
            isStepComplete={!!registeredOneCT}
            onCLick={
              registeredOneCT
                ? () => {
                    toastify({
                      msg: ` ${oneCtAddress} already registered `,
                      type: 'success',
                      id: 'alreadyregistered',
                    });
                  }
                : handleRegister
            }
          />
        </div>
        <TimingBar
          totalMiliSeconds={toatlMiliseconds}
          startTimer={shouldStartTimer}
        />
      </ModalBase>
    </>
  );
};

export { OneCTModal };
