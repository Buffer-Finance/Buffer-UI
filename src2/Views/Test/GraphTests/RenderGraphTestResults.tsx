import { useReferralTotals } from './useReferralTotals';

export const RenderGraphTestResults = () => {
  const { totalData } = useReferralTotals(
    'https://subgraph.satsuma-prod.com/e66b06ce96d2/bufferfinance/v2.5-arbitrum-mainnet/api'
  );
  if (totalData === undefined) return <></>;
  else return <div className="text-f14">{JSON.stringify(totalData)}</div>;
};
