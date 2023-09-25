export const NumInput: React.FC<{
  value: number;
  setValue: (newValue: number) => void;
}> = ({ setValue, value }) => {
  return (
    <div>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value))}
        className="bg-2 rounded-[5px] p-2 w-[100px]"
      />
    </div>
  );
};
