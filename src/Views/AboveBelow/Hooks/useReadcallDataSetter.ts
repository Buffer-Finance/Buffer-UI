import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getCallId } from '@Utils/Contract/multiContract';
import { toFixed } from '@Utils/NumString';
import { multiply } from '@Utils/NumString/stringArithmatics';
import { useCall2Data } from '@Utils/useReadCall';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { timeToMins } from '@Views/TradePage/utils/timeToMins';
import { useAtomValue, useSetAtom } from 'jotai';
import { erc20ABI } from 'wagmi';
import CreationWindowABI from '../abis/CreationWindow.json';
import OptionABI from '../abis/Options.json';
import {
  aboveBelowActiveMarketsAtom,
  aboveBelowMarketsAtom,
  readCallResponseAtom,
} from '../atoms';
import { useNumberOfContracts } from './useNumberOfContracts';

export const useReacallDataSetter = () => {
  const activeMarkets = useAtomValue(aboveBelowActiveMarketsAtom);
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const setResponse = useSetAtom(readCallResponseAtom);
  const tradeData = useNumberOfContracts();

  const readCalls = [];
  if (activeChain) {
    if (markets !== null) {
      const uniqueCreationWindow = [
        ...new Set(
          markets.map((market) =>
            getCallId(
              market.config.creationWindowContract,
              '-creationWindow' + `-${market.category}`
            )
          )
        ),
      ];
      readCalls.push(
        ...uniqueCreationWindow.map((id) => ({
          address: id.split('-')[0],
          abi: CreationWindowABI,
          name: 'isInCreationWindow',
          params: [timeToMins('00:60') as never],
          id,
        }))
      );
    }
    if (activeMarkets.length > 0 && address !== undefined) {
      const configData = getConfig(activeChain.id);
      readCalls.push(
        ...activeMarkets
          .map((market) => [
            {
              address: market.poolInfo.tokenAddress,
              abi: erc20ABI,
              name: 'balanceOf',
              params: [address],
              id: getCallId(market.poolInfo.token, '-balance'),
            },
            {
              address: market.poolInfo.tokenAddress,
              abi: erc20ABI,
              name: 'allowance',
              params: [address, configData.above_below_router],
              id: getCallId(market.poolInfo.token, '-allowance'),
            },
          ])
          .flat()
      );

      if (tradeData !== null) {
        const marketId = tradeData.selectedStrikeData.marketID;
        const fee = tradeData.isAbove
          ? tradeData.selectedStrikeData.baseFeeAbove
          : tradeData.selectedStrikeData.baseFeeBelow;
        readCalls.push(
          ...activeMarkets.map((market) => ({
            address: market.address,
            abi: OptionABI,
            name: 'getMaxPermissibleContracts',
            params: [
              marketId,
              toFixed(multiply(fee.toString(), market.poolInfo.decimals), 0),
              tradeData.isAbove,
            ],
            id: getCallId(
              market.address,
              'getMaxPermissibleContracts',
              tradeData.selectedStrikeData.strike
            ),
          }))
        );
      }
    }
  }

  const { data } = useCall2Data(readCalls, 'aboveBelowReadCalls');
  console.log(data, readCalls);
  setResponse(data);
};
