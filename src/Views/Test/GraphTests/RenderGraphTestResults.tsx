import { useReferralTotals } from './useReferralTotals';

export const RenderGraphTestResults = () => {
  const { totalData } = useReferralTotals(
    `https://subgraph.satsuma-prod.com/${
      import.meta.env.VITE_SATSUMA_KEY
    }/bufferfinance/v2.5-arbitrum-mainnet/api`
  );
  if (totalData === undefined) return <></>;
  else return <div className="text-f14">{JSON.stringify(totalData)}</div>;
};
