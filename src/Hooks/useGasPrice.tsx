import NumberTooltip from '@Views/Common/Tooltips';
import { ReactNode } from 'react';
import { useGasPrice } from 'wagmi';

// const MAX_GAS_PRICE = 300000n;
// const MAX_GAS_PRICE = 35000000n;
const MAX_GAS_PRICE = 56000000n;

export function useGasPriceCheck() {
  const { data: currentGasPrice } = useGasPrice({ chainId: 42161 });
  console.log('currentGasPrice', currentGasPrice);
  const isGasPriceHigh = currentGasPrice && currentGasPrice > MAX_GAS_PRICE;

  return { isGasPriceHigh };
}
export const GasCheckWrapperForTradeSettlement: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { isGasPriceHigh } = useGasPriceCheck();
  if (isGasPriceHigh) {
    return (
      <NumberTooltip
        content={
          'Auto settlement of trade taking longer than expected due to high gas prices'
        }
      >
        <div className="flex items-center gap-2 chip-styles-info ">
          <img src="/fee.png" className="w-[18px] h-[18px]" />
          Gas price too high!
        </div>
      </NumberTooltip>
    );
  }
  return children;
};
