import styled from '@emotion/styled';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { Launch } from '@mui/icons-material';
import { divide, gte } from '@Utils/NumString/stringArithmatics';
import { useQTinfo } from '@Views/BinaryOptions';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { Col } from '@Views/Common/ConfirmationModal';
import { Display } from '@Views/Common/Tooltips/Display';
import { useLeaderboardQuery } from '@Views/V2-Leaderboard/Hooks/useLeaderboardQuery';
import { useWeeklyLeaderboardQuery } from '@Views/V2-Leaderboard/Hooks/useWeeklyLeaderboardQuery';
import { usdcDecimals } from '@Views/V2-Leaderboard/Incentivised';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProfileGraphQl } from '../Hooks/useProfileGraphQl';

export const UserData = () => {
  const { address } = useUserAccount();
  const { winnerUserRank: dailyRank } = useLeaderboardQuery();
  const { winnerUserRank: weeklyRank } = useWeeklyLeaderboardQuery();
  const { highestTierNFT } = useHighestTierNFT({ userOnly: false });
  const { tradingMetricsData } = useProfileGraphQl();

  //finds the address with the highest number from the tradingMetricsData.tradesPerAsset object
  const mostTradedAssetAddress = useMemo(() => {
    if (!tradingMetricsData || !tradingMetricsData.tradesPerAsset) return null;
    return Object.keys(tradingMetricsData.tradesPerAsset).reduce((a, b) =>
      tradingMetricsData.tradesPerAsset[a] >
      tradingMetricsData.tradesPerAsset[b]
        ? a
        : b
    );
  }, [tradingMetricsData]);

  //fetches the data of the asset from the config
  const mostTradedAsset = useGetAssetData({
    assetAddress: mostTradedAssetAddress,
  });

  return (
    <div className="flex items-center justify-between flex-wrap sm:items-stretch sm:gap-4">
      {/* left side -- pfp and address */}

      <div className="flex items-center gap-7 sm:gap-5">
        <div className="relative w-[113px] h-[113px]">
          <CircleAroundPicture />
          {highestTierNFT !== null ? (
            <img
              src={
                'https://gateway.pinata.cloud/ipfs/' +
                highestTierNFT?.nftImage.split('://')[1]
              }
              alt=""
              width={100}
              height={100}
              className={
                'absolute z-0 rounded-full left-[0] right-[0] top-[0] bottom-[0] m-auto'
              }
            />
          ) : (
            <img
              src="https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-large/1f419@2x.png"
              width={60}
              height={60}
              className={
                'absolute z-0 rounded-full left-[0] right-[0] top-[0] bottom-[0] m-auto'
              }
            />
          )}
        </div>
        <div className="text-[25px] text-buffer-blue sm:text-f18">
          <a
            href={`https://arbiscan.io/address/${address}`}
            target="_blank"
            className="flex items-center gap-3"
          >
            {address ? address.slice(0, 7) + '...' + address.slice(-7) : '-'}{' '}
            <Launch className="scale-125 mt-1" />
          </a>
        </div>
      </div>

      {/* right side -- data */}
      <DataWrapper className="bg-2 px-7 py-[20px] rounded-lg flex items-center justify-start my-6 sm:!w-full sm:flex-wrap sm:gap-y-5 whitespace-nowrap">
        <Col
          className={'winner-card'}
          head={'Daily Rank'}
          desc={dailyRank}
          headClass={'text-f14'}
          descClass={'text-f16 text-buffer-blue'}
        />
        {/* <Separator /> */}
        <Col
          className={'winner-card'}
          head={'Weekly Rank'}
          desc={weeklyRank}
          headClass={'text-f14'}
          descClass={'text-f16 text-buffer-blue'}
        />
        {/* <Separator /> */}
        <Col
          className={'winner-card'}
          head={'Net Pnl'}
          desc={
            tradingMetricsData ? (
              <Display
                data={divide(tradingMetricsData.net_pnl, usdcDecimals)}
                unit="USDC"
              />
            ) : (
              'counting'
            )
          }
          headClass={'text-f14'}
          descClass={`text-f16 ${
            tradingMetricsData && gte(tradingMetricsData.net_pnl, '0')
              ? 'text-green'
              : 'text-red'
          }`}
        />
        {/* <Separator /> */}
        <Col
          className={'winner-card'}
          head={'Most Traded Asset'}
          desc={
            mostTradedAsset ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-[20px] w-[20px]">
                  <PairTokenImage pair={mostTradedAsset.pair} />
                </div>
                {mostTradedAsset.pair}
              </div>
            ) : (
              <>-</>
            )
          }
          headClass={'text-f14'}
          descClass={'text-f16 text-buffer-blue'}
        />
      </DataWrapper>
    </div>
  );
};

const Separator = () => {
  return <div className="w-1 h-auto bg-cross-bg mx-5 sm:mx-[0]"></div>;
};

const useGetAssetData = ({ assetAddress }: { assetAddress: string | null }) => {
  const { pairs } = useQTinfo();
  if (assetAddress === null) return undefined;
  return pairs.find((pair) =>
    pair.pools.find(
      (pool) =>
        pool.options_contracts.current.toLowerCase() ===
        assetAddress.toLowerCase()
    )
  );
};

const CircleAroundPicture = () => {
  return (
    <svg
      className="absolute z-10"
      width="113"
      height="113"
      viewBox="0 0 113 113"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M91.378 14.6205C101.378 22.939 108.069 34.5628 110.241 47.3879"
        stroke="#A3E3FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
      <path
        d="M64.13 2.52834C69.8912 3.33573 75.4848 5.06554 80.696 7.65134"
        stroke="#A3E3FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
      <path
        d="M111 56.5C111 67.2791 107.804 77.8161 101.815 86.7786C95.8266 95.741 87.3148 102.726 77.3563 106.851C67.3977 110.976 56.4396 112.056 45.8676 109.953C35.2956 107.85 25.5847 102.659 17.9627 95.0373C10.3407 87.4153 5.15012 77.7044 3.04723 67.1324C0.944333 56.5604 2.02361 45.6023 6.14859 35.6437C10.2736 25.6852 17.259 17.1734 26.2214 11.1849C35.1839 5.19637 45.7209 2 56.5 2"
        stroke="#3772FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
    </svg>
  );
};

const DataWrapper = styled.div`
  .winner-card {
    border-right: 1px solid #2d2d3d;
    padding: 0 30px;

    :first-of-type {
      padding-left: 0;
    }
    :last-of-type {
      padding-right: 0;
      border: none;
    }
    @media (max-width: 600px) {
      width: 50%;
      padding: 0;
      :nth-of-type(even) {
        border-right: none;
      }
    }
  }
`;
