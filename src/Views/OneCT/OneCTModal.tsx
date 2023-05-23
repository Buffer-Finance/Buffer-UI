import { useAtomValue, useSetAtom } from 'jotai';
import { ModalBase } from 'src/Modals/BaseModal';
import { LightningIcon, isOneCTModalOpenAtom } from './OneCTButton';
import { useEffect, useState } from 'react';
import { is1CTEnabled, useOneCTWallet } from './useOneCTWallet';
import { CloseOutlined } from '@mui/icons-material';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useIndependentWriteCall } from '@Hooks/writeCall';
import { activeAssetStateAtom, useQTinfo } from '@Views/BinaryOptions';
import RouterAbi from '@Views/BinaryOptions/ABI/routerABI.json';
import { useToast } from '@Contexts/Toast';

const OneCTModal: React.FC<any> = ({}) => {
  const isModalOpen = useAtomValue(isOneCTModalOpenAtom);
  const setModal = useSetAtom(isOneCTModalOpenAtom);
  const [laoding, setLaoding] = useState(false);
  const { activeChain } = useActiveChain();
  const { generatePk, registeredOneCT, registerOneCt, createLoading, oneCtPk } =
    useOneCTWallet();
  const { writeCall } = useIndependentWriteCall();
  const res = useAtomValue(activeAssetStateAtom);
  const provider = useProvider({ chainId: activeChain.id });

  const qtInfo = useQTinfo();
  const toastify = useToast();
  const handleRegister = (privateKey?: string) => {
    if (privateKey || oneCtPk) {
      const oneCTWallet = new ethers.Wallet(
        privateKey || oneCtPk,
        provider as ethers.providers.StaticJsonRpcProvider
      );
      const isOneCTEnabled = is1CTEnabled(
        res.user2signer || [ethers.constants.AddressZero],
        privateKey || oneCtPk,
        provider
      );
      if (isOneCTEnabled) {
        return toastify({
          msg: 'You have already registered your 1CT Account. You can start 1CT now!',
          type: 'success',
        });
      }
      setLaoding(true);
      writeCall(
        qtInfo.routerContract,
        RouterAbi,
        (payload) => {
          setLaoding(false);
          if (payload.payload)
            toastify({
              msg: 'You can seemlessly trade with just a Click!',
              type: 'success',
            });
        },
        registerOneCt,
        [oneCTWallet?.address]
      );
    }
  };
  const initializers = async () => {
    if (!isModalOpen) return;
    console.log(`[flow]OneCTModal-oneCTWallet: `, oneCtPk);
    if (!oneCtPk) {
      const pk = await generatePk();
      console.log(`[flow]pk generated: `, pk);

      handleRegister(pk);
      return;
    } else if (!registeredOneCT) return handleRegister();
  };
  useEffect(() => {
    initializers();
  }, [isModalOpen]);

  return (
    <ModalBase open={isModalOpen} onClose={() => setModal((m) => false)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <LightningIcon className=" scale-110" />
          <h3 className="font-[500] text-f20  ml-[20px]">One Click Trading</h3>
        </div>
        <button
          className="p-3 text-1 rounded-full bg-2"
          onClick={() => setModal((m) => false)}
        >
          <CloseOutlined className="!scale-125" />
        </button>
      </div>

      <div className="flex-col mt-[25px] text-3 text-f14 font-[500]">
        <Card>
          <>
            <div className="">Create 1CT Account</div>
            {oneCtPk ? (
              <div className="flex gap-x-2">
                <GreenTickMark />
                Created
              </div>
            ) : (
              <BlueBtn
                className=" !w-fit px-[15px]"
                onClick={generatePk}
                isLoading={createLoading}
              >
                Create
              </BlueBtn>
            )}
          </>
        </Card>
        <Card>
          <>
            <div className="text-3 text-f14 font-[500]">
              Register your 1CT Address
            </div>
            {!registeredOneCT ? (
              <BlueBtn
                className=" !w-fit px-[15px]"
                onClick={handleRegister}
                isLoading={laoding}
              >
                Register
              </BlueBtn>
            ) : (
              <div className="flex gap-x-2">
                <GreenTickMark />
                Registered
              </div>
            )}
          </>
        </Card>
      </div>
    </ModalBase>
  );
};

export { OneCTModal };

const Card = ({ children }: { children: JSX.Element }) => (
  <div className="bg-1 w-[360px] p-[20px] flex items-center justify-between rounded-[10px] mt-[12px]">
    {children}
  </div>
);
import { SVGProps } from 'react';
import { useProvider } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ethers } from 'ethers';
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
