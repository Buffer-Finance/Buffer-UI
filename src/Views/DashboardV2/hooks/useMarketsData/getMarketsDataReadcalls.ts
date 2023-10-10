import { getCallId } from '@Utils/Contract/multiContract';
import CreationWindowABI from '@Views/TradePage/ABIs/CreationWindowABI.json';
import OptionContractABI from '@Views/TradePage/ABIs/OptionContract.json';
import { IBaseSettlementFees } from '@Views/TradePage/Hooks/useSettlementFee';
import { marketType } from '@Views/TradePage/type';
import { joinStrings } from '@Views/TradePage/utils';
import { timeToMins } from '@Views/TradePage/utils/timeToMins';

export const getMarketsDataReadcalls = (
  config: marketType[] | null,
  baseSettlementFees: IBaseSettlementFees | undefined,
  address: string | undefined,
  referralData: any[],
  activeChain: number | undefined
) => {
  if (!config || !referralData || !activeChain) return [];

  let optionCalls = config
    ?.map((market) => {
      const baseSettlementFee =
        baseSettlementFees?.[joinStrings(market.token0, market.token1, '')]
          ?.settlement_fee;
      const creation_window = market.creation_window_contract;

      return market.pools
        .map((pool) => {
          const calls = [
            {
              address: pool.optionContract,
              abi: OptionContractABI,
              name: 'getMaxTradeSize',
              params: [],
              id: getCallId(pool.optionContract, 'getMaxTradeSize'),
            },
            {
              address: pool.optionContract,
              abi: OptionContractABI,
              name: 'getMaxOI',
              params: [],
              id: getCallId(pool.optionContract, 'getMaxOI'),
            },
            {
              address: pool.optionContract,
              abi: OptionContractABI,
              name: 'totalMarketOI',
              params: [],
              id: getCallId(pool.optionContract, 'totalMarketOI'),
            },
          ];
          if (address && baseSettlementFee) {
            calls.push({
              address: pool.optionContract,
              abi: OptionContractABI,
              name: 'getSettlementFeePercentage',
              params: [
                referralData[3],
                address,
                baseSettlementFee?.toString() ?? '1500',
              ] as never,
              id: getCallId(
                pool.optionContract,
                'getSettlementFeePercentage',
                referralData[3],
                address,
                baseSettlementFee?.toString() ?? '1500'
              ),
            });
          }
          if (creation_window !== undefined) {
            calls.push({
              address: creation_window,
              abi: CreationWindowABI,
              name: 'isInCreationWindow',
              params: [timeToMins('00:60') as never],
              id: getCallId(creation_window, 'isInCreationWindow'),
            });
          }
          return calls;
        })
        .flat(1);
    })
    .flat(1);
  // optionCalls?.push({
  //   address: configData.creation_window,
  //   abi: CreationWindowABI,
  //   name: 'isInCreationWindow',
  //   params: [timeToMins('00:05')],

  // });

  return [...optionCalls!];
};
