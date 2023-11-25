import { useActiveChain } from '@Hooks/useActiveChain';
import { useCall2Data } from '@Utils/useReadCall';
import CircuitBreakerABI from '@Views/TradePage/ABIs/CircuitBreakerABI.json';
import { responseObj } from '@Views/TradePage/type';
import { getConfig } from '@Views/TradePage/utils/getConfig';

export const useReadCallData = (markets: responseObj[] | undefined) => {
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  if (markets === undefined || config === undefined) return null;
  const marketAddresses = markets.map((market) => {
    return market.address;
  });
  const call = [
    {
      address: config.cb,
      abi: CircuitBreakerABI,
      name: 'getAllMarketsData',
      params: [marketAddresses],
    },
  ];
  const { data: response } = useCall2Data(call, 'getAllMarketsData');
  console.log(response, 'response');
};
