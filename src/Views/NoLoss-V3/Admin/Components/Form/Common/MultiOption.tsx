export const MultiOption: React.FC<{
  options: JSX.Element[];
  onClick: (selectedOptionIndex: number) => void;
  selectedOptionIndexes: number[];
}> = ({ options, onClick, selectedOptionIndexes }) => {
  return (
    <div className="flex gap-3">
      {options.map((option, index) => {
        const isSelected = selectedOptionIndexes.includes(index);
        return (
          <button
            key={index}
            onClick={() => {
              onClick(index);
            }}
            className={`${
              isSelected ? 'text-1' : 'text-[#808191]'
            } px-3 py-2 text-f13 rounded-sm bg-[#182b39]`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
};
