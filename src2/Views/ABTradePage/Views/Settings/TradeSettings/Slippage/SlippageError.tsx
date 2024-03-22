import { MAX_SLIPPAGE, MIN_SLIPPAGE } from '@Views/TradePage/config';

export const SlippageError: React.FC<{ slippage: number }> = ({ slippage }) => {
  const error = getSlippageError(slippage);
  return <span className="text-red whitespace-nowrap">{error}</span>;
};

export function getSlippageError(slippage: number) {
  let error = null;
  if (slippage > MAX_SLIPPAGE) {
    error = `Slippage tolerance must be less then ${MAX_SLIPPAGE}%`;
  } else if (slippage < MIN_SLIPPAGE) {
    error = `Slippage tolerance must be greater than ${MIN_SLIPPAGE}%`;
  }
  return error;
}
