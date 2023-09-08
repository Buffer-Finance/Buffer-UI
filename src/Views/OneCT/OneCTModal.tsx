import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import NumberTooltip from '@Views/Common/Tooltips';
import { BlueBtn } from '@Views/Common/V2-Button';
import { showOnboardingAnimationAtom } from '@Views/TradePage/atoms';
import { baseUrl } from '@Views/TradePage/config';
import { getWalletFromOneCtPk } from '@Views/TradePage/utils/generateTradeSignature';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { CloseOutlined } from '@mui/icons-material';
import { signTypedData } from '@wagmi/core';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import { SVGProps, useState } from 'react';
import { ModalBase } from 'src/Modals/BaseModal';
import { getAddress, zeroAddress } from 'viem';
import { useAccount } from 'wagmi';
import {
  InstantSVG,
  NonCustodialSVG,
  OneClickSVG,
  ZeroGasSVG,
} from './FeaturesSVGs';
import { isOneCTModalOpenAtom } from './OneCTButton';
import { TimingBar } from './TimingBar';
import { EIP712Domain, useOneCTWallet } from './useOneCTWallet';

const features = [
  {
    desc: 'Zero Gas',
    img: <ZeroGasSVG />,
    tooltip: `Trade gas-free without worrying about fluctuating gas price`,
  },
  {
    desc: 'Instant',
    img: <InstantSVG />,
    tooltip: `Get instant trade confirmation without waiting for block to be mined`,
  },
  {
    desc: '1 Click',
    img: <OneClickSVG />,
    tooltip: `Say goodbye to wallet confirmations and hello to 2x faster trading`,
  },

  {
    desc: 'Non Custodial',
    img: <NonCustodialSVG />,
    tooltip: `Trade with full custody of your funds. No deposit or signups required.`,
  },
];
const desc = 'text-[#C2C1D3] font-normal sm:text-f10';
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
          <div className="flex justify-between mb-4 ">
            {features.map((s, idx) => {
              return (
                <NumberTooltip key={s.tooltip} content={s.tooltip}>
                  <div
                    className={`flex w-1/4 flex-col content-center items-center ${
                      idx < features.length - 1 ? 'border-right' : ''
                    }`}
                  >
                    {s.img}
                    <div className="mt-3 whitespace-nowrap text-[#C2C1D3]">
                      {s.desc}
                    </div>
                  </div>
                </NumberTooltip>
              );
            })}
          </div>
          <Card>
            <>
              <div className="flex flex-col items-start sm:text-f13">
                Create your account
                <div className={desc}>Sign using a web 3 wallet</div>
              </div>
              <BlueBtn
                className={` !w-[120px] px-[15px] sm:px-3 sm:text-f12 ${
                  oneCtPk ? '!bg-green' : ''
                }`}
                test-id="one-ct-creation-button-god"
                onClick={
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
                isLoading={createLoading}
              >
                {oneCtPk ? (
                  <div className="flex items-center">
                    {' '}
                    <GreenTickMark /> Created
                  </div>
                ) : (
                  'Create'
                )}
              </BlueBtn>
            </>
          </Card>
          <Card>
            <>
              <div className="flex flex-col items-start sm:text-f12">
                Register your account
                <div className={desc}>No gas required</div>
              </div>
              <BlueBtn
                className={`${
                  registeredOneCT ? '!bg-green' : ''
                } !w-[120px] px-[15px] sm:px-3 sm:text-f13`}
                test-id="one-ct-registration-button-god"
                onClick={
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
                isLoading={laoding}
              >
                {registeredOneCT ? (
                  <div className="flex items-center">
                    {' '}
                    <GreenTickMark /> Registered
                  </div>
                ) : (
                  'Register'
                )}
              </BlueBtn>
            </>
          </Card>
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

const Card = ({ children }: { children: JSX.Element }) => (
  <div className="w-full bg-[#2C2C41] p-[20px] sm:px-[12px] sm:py-[12px] flex items-center justify-between rounded-[10px] mt-[12px] text-1 text-f16 sm:text-f14 font-[500]">
    {children}
  </div>
);

const GreenTickMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={17}
    fill="none"
    {...props}
  >
    <path
      fill="#3FB68B"
      d="M0 3a3 3 0 0 1 3-3h11.657a3 3 0 0 1 3 3v10.041a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3Z"
    />
    <path stroke="#fff" strokeWidth={2} d="m4 9 3 3 6.5-8" />
  </svg>
);
