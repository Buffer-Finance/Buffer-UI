import HorizontalNonLinearStepper from '../Stepper';
import { SubmitButton } from './SubmitButton';
import { useFormConditions } from './useFormValidations';

export const Form: React.FC<{
  currentStep: number;
  setActiveStep: (newIndex: number) => void;
  completed: number[] | null;
  setCompleted: (newIndex: number | null) => void;
}> = ({ currentStep, setActiveStep, completed, setCompleted }) => {
  const validateForm = useFormConditions();
  return (
    <div className="flex flex-col gap-4 m-auto mt-3">
      <HorizontalNonLinearStepper
        steps={[
          'Tournament Meta',
          'Tournament Conditions',
          'Leaderboard Conditions',
        ]}
        activeStateIndex={currentStep}
        setActiveStep={setActiveStep}
        completed={completed}
        setCompleted={setCompleted}
        submitButton={<SubmitButton />}
        isFormFilled={validateForm}
      />
    </div>
  );
};
