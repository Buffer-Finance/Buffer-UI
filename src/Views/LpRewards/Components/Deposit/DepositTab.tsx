import { poolsType } from '@Views/LpRewards/types';
import { useState } from 'react';
import { InputField } from './InputField';

export const DepositTab: React.FC<{ activePool: poolsType }> = ({
  activePool,
}) => {
  const [amount, setAmount] = useState<string>('');
  return (
    <div>
      <InputField
        activePool={activePool}
        setValue={setAmount}
        balance={'40000000000000000000'}
      />
    </div>
  );
};
