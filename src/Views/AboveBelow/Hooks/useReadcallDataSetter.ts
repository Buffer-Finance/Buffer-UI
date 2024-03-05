import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { getCallId } from '@Utils/Contract/multiContract';
import { useCall2Data } from '@Utils/useReadCall';
import { timeToMins } from '@Views/TradePage/utils/timeToMins';
import { useAtomValue, useSetAtom } from 'jotai';
import { erc20ABI } from 'wagmi';
import CreationWindowABI from '../abis/CreationWindow.json';
import OptionContractABI from '../abis/Options.json';
import {
  aboveBelowActiveMarketsAtom,
  aboveBelowMarketsAtom,
  readCallResponseAtom,
} from '../atoms';
// import { useSettlementFee } from './useSettlementFee';
import { useReferralCode } from '@Views/Referral/Utils/useReferralCode';
import { useSettlementFee } from '@Views/TradePage/Hooks/useSettlementFee';
import { joinStrings } from '@Views/TradePage/utils';

export const useReacallDataSetter = () => {
  const activeMarkets = useAtomValue(aboveBelowActiveMarketsAtom);
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const { activeChain } = useActiveChain();
  const { address } = useUserAccount();
  const setResponse = useSetAtom(readCallResponseAtom);
  const { data: baseSettlementFees } = useSettlementFee();
  const referralData = useReferralCode();

  const readCalls = [];
  if (activeChain) {
    if (markets !== null) {
      markets.map((market) => {
        const baseSettlementFee =
          baseSettlementFees?.[joinStrings(market.token0, market.token1, '')]
            ?.settlement_fee;
        const creation_window = market.config.creationWindowContract;

        if (address && baseSettlementFee) {
          readCalls.push({
            address: market.address,
            abi: OptionContractABI,
            name: 'getSettlementFeePercentage',
            params: [
              referralData[3],
              address,
              baseSettlementFee?.toString() ?? '1500',
            ] as never,
            id: getCallId(
              market.config.creationWindowContract,
              '-creationWindow' + `-${market.category}`
            ),
          });
        }
        if (creation_window !== undefined) {
          readCalls.push({
            address: creation_window,
            abi: CreationWindowABI,
            name: 'isInCreationWindow',
            params: [timeToMins('00:60') as never],
            id: getCallId(creation_window, '-isInCreationWindow'),
          });
        }
      });
    }
    if (activeMarkets.length > 0 && address !== undefined) {
      // const configData = getConfig(activeChain.id);
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
            // {
            //   address: market.poolInfo.tokenAddress,
            //   abi: erc20ABI,
            //   name: 'allowance',
            //   params: [address, configData.above_below_router],
            //   id: getCallId(market.poolInfo.token, '-allowance'),
            // },
          ])
          .flat()
      );
    }
  }
  const { data } = useCall2Data(readCalls, 'aboveBelowReadCalls');
  setResponse(data);
};
