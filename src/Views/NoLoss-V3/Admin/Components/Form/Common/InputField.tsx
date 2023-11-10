import { ChangeEvent } from 'react';

export const InputField: React.FC<{
  value: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}> = ({ value, onChange, placeholder }) => {
  return (
    <input
      placeholder={placeholder}
      className="bg-[#182b39] text-1 px-3 py-2 text-f13 rounded-sm"
      value={value}
      onChange={onChange}
    />
  );
};
