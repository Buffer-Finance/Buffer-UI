import { escapeRegExp, inputRegex } from '@Views/NoLoss-V3/helpers/inputRegex';

export const TradeSizeInput: React.FC<{
  maxTradeSize: string;
  balance: string;
  minTradeSize: string;
  onSubmit?: () => void;
  tradeSize: string;
  setTradeSize: (value: string) => void;
  setMaxValue: () => void;
}> = ({
  maxTradeSize,
  balance,
  onSubmit,
  minTradeSize,
  setTradeSize,
  tradeSize,
  setMaxValue,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative flex flex-row gap-x-4 items-center">
        <input
          value={tradeSize}
          max={maxTradeSize}
          min={minTradeSize}
          pattern="^[0-9]*[.,]?[0-9]*$"
          type="text"
          className={`relative h-[40px] bg-[#282b39] px-5 py-3 rounded-l-[5px] outline-none w-full text-f16 text-1 sm:h-[35px]`}
          onChange={(e) => {
            if (inputRegex.test(escapeRegExp(e.target.value))) {
              let newValue = e.target.value;
              // Check if newValue has more than 3 decimal places
              const decimalPart = newValue.split('.')[1];
              if (decimalPart && decimalPart.length > 3) {
                // If yes, limit it to 3 decimal places
                newValue = parseFloat(newValue).toFixed(3);
              }
              setTradeSize(newValue);
            }
          }}
          onKeyDown={(e) => e.key == 'Enter' && onSubmit?.()}
          placeholder="Enter value"
        />
        <button
          className="absolute right-3 bg-[#141823] rounded-[6px] py-2 px-[6px] text-f12"
          onClick={setMaxValue}
        >
          Max
        </button>
      </div>
    </div>
  );
};
