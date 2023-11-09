import { ChangeEvent } from 'react';

export const InputField: React.FC<{
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange }) => {
  return (
    <input
      placeholder="Enter the name of the tournament."
      className="bg-[#182b39] text-1 px-3 py-2 text-f12 rounded-sm"
      value={value}
      onChange={onChange}
    />
  );
};
