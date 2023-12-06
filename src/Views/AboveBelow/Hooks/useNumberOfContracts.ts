import { BlackScholes } from '@Utils/Formulas/blackscholes';
import { toFixed } from '@Utils/NumString';
import { divide, multiply } from '@Utils/NumString/stringArithmatics';
import { useCurrentPrice } from '@Views/TradePage/Hooks/useCurrentPrice';
import { solidityKeccak256 } from 'ethers/lib/utils';
import { useAtomValue } from 'jotai';
import { getAddress } from 'viem';
import {
  selectedExpiry,
  selectedPoolActiveMarketAtom,
  selectedPriceAtom,
  tradeSizeAtom,
} from '../atoms';
import { useIV } from './useIV';
import { useSettlementFee } from './useSettlementFee';

export const useNumberOfContracts = () => {
  const amount = useAtomValue(tradeSizeAtom);
  const selectedTimestamp = useAtomValue(selectedExpiry);
  const selectedPrice = useAtomValue(selectedPriceAtom);
  const activeMarket = useAtomValue(selectedPoolActiveMarketAtom);
  const { data: settlementFees } = useSettlementFee();
  const { currentPrice } = useCurrentPrice({
    token0: activeMarket?.token0,
    token1: activeMarket?.token1,
  });
  const { data: ivs } = useIV();
  if (!amount) return null;
  if (!selectedTimestamp) return null;
  if (!selectedPrice) return null;
  if (!activeMarket) return null;
  if (!currentPrice) return null;
  if (!settlementFees) return null;
  const iv = ivs?.[activeMarket.tv_id];
  if (iv === undefined) return null;

  const priceObj = selectedPrice[activeMarket.tv_id];
  if (!priceObj) return null;
  const price = priceObj.price;
  const currentEpoch = Math.floor(Date.now() / 1000);
  const expiration = Math.floor(selectedTimestamp / 1000);

  const marketHash = solidityKeccak256(
    ['uint256', 'uint256'],
    [toFixed(multiply(price, 8), 0), Math.floor(selectedTimestamp / 1000) + 1]
  );
  const settlementFee =
    settlementFees[marketHash + '-' + getAddress(activeMarket.address)];
  const probability = BlackScholes(
    true,
    priceObj.isAbove,
    currentPrice,
    price,
    expiration - currentEpoch,
    0,
    iv
  );
  const sfAbove = settlementFee?.sf_above || settlementFees['Base'] / 1e4;
  const sfBelow = settlementFee?.sf_below || settlementFees['Base'] / 1e4;
  const totalFee =
    probability + (priceObj.isAbove ? sfAbove : sfBelow) * probability;

  return {
    contracts: toFixed(divide(amount, totalFee.toString()) as string, 0),
    totalFee,
    amount,
    sf: priceObj.isAbove ? sfAbove : sfBelow,
    currentPrice,
    strike: price,
    expiration,
    isAbove: priceObj.isAbove,
  };
};
