import { useAtom } from 'jotai';
import { FromStateAtom } from '../Atoms/Form';
import { Form } from './Form';

export const Create = () => {
  const [{ currentFormStep, completedSteps }, setCurrentStep] =
    useAtom(FromStateAtom);
  return (
    <Form
      currentStep={currentFormStep}
      setActiveStep={(newIndex) =>
        setCurrentStep((prvState) => ({
          ...prvState,
          currentFormStep: newIndex,
        }))
      }
      completed={completedSteps}
      setCompleted={(newIndex) => {
        if (newIndex === null) {
          setCurrentStep((prvState) => ({
            ...prvState,
            completedSteps: null,
          }));
        } else {
          setCurrentStep((prvState) => ({
            ...prvState,
            completedSteps:
              prvState.completedSteps !== null
                ? [...prvState.completedSteps, newIndex]
                : [newIndex],
          }));
        }
      }}
    />
  );
};
