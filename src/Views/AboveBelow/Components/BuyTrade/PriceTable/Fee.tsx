import { BlackScholes } from '@Utils/Formulas/blackscholes';

export const Fee: React.FC<{
  isAbove: boolean;
  currentPrice: number;
  strikePrice: number;
  expiration: number;
  settlementFee: number;
  isSelected: boolean;
  iv: number;
  setStrikePrice: (isAbove: boolean, strikePrice: string) => void;
}> = ({
  isAbove,
  currentPrice,
  strikePrice,
  expiration,
  settlementFee,
  isSelected,
  setStrikePrice,
  iv,
}) => {
  const currentEpoch = Math.floor(Date.now() / 1000);
  const probability = BlackScholes(
    true,
    isAbove,
    currentPrice,
    strikePrice,
    Math.floor(expiration / 1000) - currentEpoch,
    0,
    iv / 1e4
  );
  const totalFee = probability + (settlementFee / 1e4) * probability;
  return (
    <button
      className={`text-1 ${
        isAbove ? 'bg-[#4D81FF] rounded-l-sm' : 'bg-[#FF5353] rounded-r-sm'
      } px-3 py-1 w-full whitespace-nowrap font-medium ${
        !isSelected ? 'opacity-50' : ''
      }`}
      onClick={() => setStrikePrice(isAbove, strikePrice.toString())}
    >
      {totalFee.toFixed(2)} ({(((1 - totalFee) / totalFee) * 100).toFixed(0)}%)
    </button>
  );
};