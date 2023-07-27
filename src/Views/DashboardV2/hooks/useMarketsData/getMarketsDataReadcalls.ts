import OptionContractABI from '@Views/TradePage/ABIs/OptionContract.json';
import CreationWindowABI from '@Views/TradePage/ABIs/CreationWindowABI.json';
import { joinStrings } from '@Views/TradePage/utils';
import { marketType } from '@Views/TradePage/type';
import { IBaseSettlementFees } from '@Views/TradePage/Hooks/useSettlementFee';
import { appConfig } from '@Views/TradePage/config';
import { getCallId } from '@Utils/Contract/multiContract';
import { timeToMins } from '@Views/TradePage/utils/timeToMins';

export const getMarketsDataReadcalls = (
  config: marketType[] | null,
  baseSettlementFees: IBaseSettlementFees | undefined,
  address: string | undefined,
  referralData: any[],
  activeChain: number | undefined
) => {
  if (!config || !referralData || !activeChain) return [];
  const configData =
    appConfig[activeChain as unknown as keyof typeof appConfig];

  let optionCalls = config
    ?.map((market) => {
      const baseSettlementFee =
        baseSettlementFees?.[joinStrings(market.token0, market.token1, '')]
          ?.settlement_fee;
      return market.pools
        .map((pool) => {
          const calls = [
            {
              address: pool.optionContract,
              abi: OptionContractABI,
              name: 'getMaxTradeSize',
              id: getCallId(pool.optionContract, 'getMaxTradeSize'),
            },
            {
              address: pool.optionContract,
              abi: OptionContractABI,
              name: 'getMaxOI',
              id: getCallId(pool.optionContract, 'getMaxOI'),
            },
            {
              address: pool.optionContract,
              abi: OptionContractABI,
              name: 'totalMarketOI',
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
              ],
              id: getCallId(
                pool.optionContract,
                'getSettlementFeePercentage',
                referralData[3],
                address,
                baseSettlementFee?.toString() ?? '1500'
              ),
            });
          }
          return calls;
        })
        .flat(1);
    })
    .flat(1);
  optionCalls?.push({
    address: configData.creation_window,
    abi: CreationWindowABI,
    name: 'isInCreationWindow',
    params: [timeToMins('00:05')],
    id: getCallId(
      configData.creation_window,
      'isInCreationWindow',
      timeToMins('00:05')
    ),
  });

  return [...optionCalls!];
};
