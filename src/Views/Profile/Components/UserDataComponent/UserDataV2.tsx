import { useActiveChain } from '@Hooks/useActiveChain';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { Col } from '@Views/Common/ConfirmationModal';
import NFTtier from '@Views/Common/NFTtier';
import { Display } from '@Views/Common/Tooltips/Display';
import { ChainSwitchDropdown } from '@Views/DashboardV2/Components/ChainSwitchDropdown';
import { useProfileGraphQl2 } from '@Views/Profile/Hooks/useProfileGraphQl2';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { marketsForChart } from '@Views/TradePage/config';
import { useLeaderboardQuery } from '@Views/V2-Leaderboard/Hooks/useLeaderboardQuery';
import { useWeeklyLeaderboardQuery } from '@Views/V2-Leaderboard/Hooks/useWeeklyLeaderboardQuery';
import styled from '@emotion/styled';
import { Launch } from '@mui/icons-material';
import { useAtom } from 'jotai';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChains } from 'src/Config/wagmiClient';
import { Chain } from 'wagmi';
import { productAtom } from '../ProfileCardsComponent/ProfileCardsV2';

const userDataHeadClass = 'text-f14 text-[#7F87A7]';
const userDataDescClass = 'text-f16 text-[#C3C2D4]';

export const UserDataV2 = () => {
  const [activeProduct] = useAtom(productAtom);

  const { address, viewOnlyMode } = useUserAccount();
  const { winnerUserRank: dailyRank } = useLeaderboardQuery();
  const { winnerUserRank: weeklyRank } = useWeeklyLeaderboardQuery();
  const { highestTierNFT } = useHighestTierNFT({ userOnly: false });
  const metrics = useProfileGraphQl2(activeProduct);
  const { activeChain } = useActiveChain();
  const chains: Chain[] = getChains();
  const navigateToTrade = useNavigateToTrade();

  const activeChainExplorer = useMemo(() => {
    const chain: Chain | undefined = chains.find(
      (chain) => chain.id === activeChain.id
    );
    if (!chain) return null;
    return chain.blockExplorers?.default.url;
  }, [chains, activeChain.id]);

  const mostTradedAsset = useMemo(() => {
    if (!metrics) return null;
    const tradesByassetArray = Object.entries(metrics.tradesByasset);
    if (tradesByassetArray.length === 0) return null;
    return tradesByassetArray.reduce(
      (acc, curr) => {
        if (acc[1] > curr[1]) {
          return acc;
        } else {
          return curr;
        }
      },
      ['-', 0]
    );
  }, [metrics]);

  const winrate = useMemo(() => {
    if (!metrics) return null;
    if (!metrics.totalNonActiveTrades) return 0;
    console.log(`UserDataV2-metrics.totalTradesWon : `, metrics.totalTradesWon);
    return (metrics.totalTradesWon * 100) / metrics.totalNonActiveTrades || 0;
  }, [metrics]);
  console.log(`UserDataV2-winrate: `, typeof metrics?.totalNonActiveTrades);

  return (
    <div className="flex items-center justify-between flex-wrap sm:items-stretch sm:gap-4 gap-7">
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
        <div>
          <div className="text-[25px] text-buffer-blue sm:text-f18">
            {address ? (
              <a
                href={`${activeChainExplorer}/address/${address}`}
                target="_blank"
                className="flex items-center gap-3"
              >
                {address.slice(0, 7) + '...' + address.slice(-7)}
                <Launch className="scale-125 mt-1" />
              </a>
            ) : (
              <>Wallet Not Connected.</>
            )}
          </div>
          {viewOnlyMode && (
            <button
              className="text-f13 text-2 flex items-center hover:text-1"
              onClick={() => {
                if (address) {
                  navigateToTrade(address);
                }
              }}
            >
              <span>See Live Trades</span>
              <img
                src="https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-medium/1f4fa.png"
                className="scale-75 mb-2"
              />
            </button>
          )}
        </div>
      </div>

      {/* right side -- data */}
      <DataWrapper className="bg-2 px-7 py-[20px] rounded-lg flex items-center justify-start my-6 max1000:!w-full max1000:flex-wrap max1000:gap-y-5 whitespace-nowrap">
        {/* <ArbitrumOnly hide> */}
        <>
          <Col
            className={'winner-card'}
            head={'Chain'}
            desc={
              <ChainSwitchDropdown
                baseUrl="/profile"
                classes={{
                  imgDimentions: 'w-[17px] h-[17px]',
                  fontSize: 'text-f13',
                  itemFontSize: 'text-f13',
                  verticalPadding: 'py-[0px]',
                }}
              />
            }
            headClass={userDataHeadClass}
            descClass={userDataDescClass}
          />
          <Col
            className={'winner-card'}
            head={'Daily Rank'}
            desc={dailyRank}
            headClass={userDataHeadClass}
            descClass={userDataDescClass}
          />
          <Col
            className={'winner-card'}
            head={'Weekly Rank'}
            desc={weeklyRank}
            headClass={userDataHeadClass}
            descClass={userDataDescClass}
          />
        </>
        {/* </ArbitrumOnly> */}
        <Col
          className={'winner-card'}
          head={'Win Rate'}
          desc={
            winrate ? (
              <Display
                data={winrate}
                unit={'%'}
                className={userDataDescClass + ' !w-full'}
                content={
                  <>{`Won ${metrics?.totalTradesWon}/${metrics?.totalNonActiveTrades} trades.`}</>
                }
              />
            ) : (
              <div title="Not won any trade yet!" className="text-light-blue">
                -
              </div>
            )
          }
          headClass={userDataHeadClass}
          descClass={`text-f16 `}
        />
        <Col
          className={'winner-card'}
          head={'Most Traded Asset'}
          desc={
            !!mostTradedAsset ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-[20px] w-[20px]">
                  <PairTokenImage
                    pair={
                      marketsForChart[
                        mostTradedAsset[0] as unknown as keyof typeof marketsForChart
                      ].pair
                    }
                  />
                </div>
                {
                  marketsForChart[
                    mostTradedAsset[0] as unknown as keyof typeof marketsForChart
                  ].pair
                }{' '}
              </div>
            ) : (
              <>-</>
            )
          }
          headClass={userDataHeadClass}
          descClass={userDataDescClass}
        />
        {viewOnlyMode && (
          <Col
            className={'winner-card'}
            head={'NFT Tier'}
            desc={<NFTtier userOnly={false} className="justify-center" />}
            headClass={userDataHeadClass}
            descClass={userDataDescClass}
          />
        )}
      </DataWrapper>
    </div>
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
        strokeWidth="3"
        stroke-miterlimit="10"
      />
      <path
        d="M64.13 2.52834C69.8912 3.33573 75.4848 5.06554 80.696 7.65134"
        stroke="#A3E3FF"
        strokeWidth="3"
        stroke-miterlimit="10"
      />
      <path
        d="M111 56.5C111 67.2791 107.804 77.8161 101.815 86.7786C95.8266 95.741 87.3148 102.726 77.3563 106.851C67.3977 110.976 56.4396 112.056 45.8676 109.953C35.2956 107.85 25.5847 102.659 17.9627 95.0373C10.3407 87.4153 5.15012 77.7044 3.04723 67.1324C0.944333 56.5604 2.02361 45.6023 6.14859 35.6437C10.2736 25.6852 17.259 17.1734 26.2214 11.1849C35.1839 5.19637 45.7209 2 56.5 2"
        stroke="#3772FF"
        strokeWidth="3"
        stroke-miterlimit="10"
      />
    </svg>
  );
};

export const DataWrapper = styled.div`
  .winner-card {
    border-right: 1px solid #393953;
    padding: 0 30px;

    :first-of-type {
      padding-left: 0;
    }
    :last-of-type {
      padding-right: 0;
      border: none;
    }
    @media (max-width: 1000px) {
      width: 50%;
      padding: 0;
      :nth-of-type(even) {
        border-right: none;
      }
    }
  }
`;

export const useNavigateToTrade = () => {
  const navigate = useNavigate();
  return (userAddress: string) => {
    navigate(`/binary/BTC-USD/?user_address=${userAddress}`);
  };
};
