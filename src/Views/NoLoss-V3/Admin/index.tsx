import { useAtomValue } from 'jotai';
import { FromStateAtom } from './Atoms/Form';
import { Form } from './Components/Form';

export const NoLossAdmin = () => {
  const { currentFormStep } = useAtomValue(FromStateAtom);
  return <Form currentStep={currentFormStep} />;
};
