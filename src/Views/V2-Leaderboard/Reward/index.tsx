import FrontArrow from '@SVG/frontArrow';
import { LeaderBoard } from '..';
import { TopData } from '../Components/TopData';
import { DailyStyles } from '../Daily/stlye';
import { rewardApiResponseType, useRewardData } from './useRewardData';
import config from './config.json';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useDayOfTournament } from '../Hooks/useDayOfTournament';
import { Table } from './Table';
import { Warning } from '@Views/Common/Notification/warning';
import appConfig from '@Public/config.json';
import { useAtom, useAtomValue } from 'jotai';
import { rewardActivePageAtom, rewardTotalPageAtom } from './atoms';
import { useMemo } from 'react';

export const ROWS_PER_PAGE = 10;
export const Reward = () => {
  const { activeChain } = useActiveChain();
  const configData = config[activeChain.id as unknown as '421613'];
  const { day } = useDayOfTournament(configData.startTimestamp * 1000);
  const currentDayData = configData[day.toString() as '1'];
  const { data } = useRewardData(
    configData.startTimestamp,
    configData.endTimestamp,
    currentDayData.pool,
    currentDayData.category,
    'ASC',
    0,
    100
  );
  const isDummyData = !!data && data.length === 0;
  const unit = currentDayData.pool.toUpperCase();
  const decimals = appConfig[activeChain.id as unknown as '421613'].tokens[
    unit as 'USDC'
  ].decimals as number;
  const content = (
    <RewardLeagueTable
      data={isDummyData ? dummyData : data}
      unit={currentDayData.pool.toUpperCase()}
      decimals={decimals}
    />
  );
  return (
    <LeaderBoard
      children={
        <DailyStyles>
          <div>
            <Warning
              closeWarning={() => {}}
              state={isDummyData}
              shouldAllowClose={false}
              body={
                <>
                  <img
                    src="/lightning.png"
                    alt="lightning"
                    className="mr-3 mt-2 h-[18px]"
                  />
                  The data is dummy data and will be updated soon.
                </>
              }
              className="!mb-3 m-auto"
            />
            <div className="m-auto mb-7">
              <TopData
                pageImage={<></>}
                heading={
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div>Reward Leaderboard</div>
                    </div>
                    <a
                      className="whitespace-nowrap flex items-center text-buffer-blue text-f13 hover:underline"
                      //TODO - new leaderboard : add link
                      href={'#'}
                      target={'blank'}
                    >
                      Contest Rules <FrontArrow className="tml w-fit inline" />
                    </a>
                  </div>
                }
                DataCom={content}
              />
            </div>
          </div>
        </DailyStyles>
      }
    />
  );
};

const RewardLeagueTable: React.FC<{
  unit: string;
  decimals: number;
  data: rewardApiResponseType[] | undefined;
}> = ({ data, unit, decimals }) => {
  const [activePage, setActivePage] = useAtom(rewardActivePageAtom);
  const totalPages = useAtomValue(rewardTotalPageAtom);

  const currentPageData = useMemo(() => {
    if (!data) return [];
    const startIndex = (activePage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return data.slice(startIndex, endIndex);
  }, [data, activePage]);

  return (
    <Table
      activePage={activePage}
      count={totalPages}
      onpageChange={setActivePage}
      decimals={decimals}
      unit={unit}
      isWinrateTable={false}
      data={currentPageData}
    />
  );
};

const dummyData = [
  {
    user_address: '0xbe9e5eaabc38a4b88f3f1c0b6e21bff94c95d49d',
    absolute_net_pnl: 96185031,
    total_volume: 1527500000,
    total_trades: 16,
    total_payout: 1623685031,
  },
  {
    user_address: '0x563d5a246c8af9fe4a8d4d4cb5f3f9de946dd838',
    absolute_net_pnl: -99029260,
    total_volume: 586400000,
    total_trades: 5,
    total_payout: 487370740,
  },
  {
    user_address: '0xcd81917ff5313d02d7da3d47a9afcd3f635c36e3',
    absolute_net_pnl: -275997086,
    total_volume: 2300000000,
    total_trades: 6,
    total_payout: 2024002914,
  },
  {
    user_address: '0xba20c76ca579c01399019608c2282cf53ad9bf67',
    absolute_net_pnl: -492213823,
    total_volume: 13656525097,
    total_trades: 57,
    total_payout: 13164311274,
  },
  {
    user_address: '0x4b655510bfe2cbec53f0cb7a3edf3a041372deab',
    absolute_net_pnl: -1270872598,
    total_volume: 16010701947,
    total_trades: 65,
    total_payout: 14739829349,
  },
];
