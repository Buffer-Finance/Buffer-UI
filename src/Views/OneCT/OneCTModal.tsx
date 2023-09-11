import { useToast } from '@Contexts/Toast';
import { CloseOutlined } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { ModalBase } from 'src/Modals/BaseModal';
import { Features } from './Features';
import { isOneCTModalOpenAtom } from './OneCTButton';
import { RegistrationStageCard } from './RegistrationStageCard';
import { TimingBar } from './TimingBar';
import { useOneCTWallet } from './useOneCTWallet';

const OneCTModal: React.FC<any> = ({}) => {
  const [isModalOpen, setModal] = useAtom(isOneCTModalOpenAtom);
  const {
    generatePk,
    oneCtAddress,
    registeredOneCT,
    createLoading,
    oneCtPk,
    shouldStartTimer,
    toatlMiliseconds,
    registrationLaoding,
    handleRegister,
  } = useOneCTWallet();
  const toastify = useToast();

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
            isLoading={registrationLaoding}
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
