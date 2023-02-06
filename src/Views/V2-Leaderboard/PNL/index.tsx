import React, { useEffect, useState } from 'react';
import { getPageNumber, LeaderBoard } from '..';
import { LEADERBOARD_LIMIT, TopData } from '../Daily';
import { PNLStyles } from './style';
import { DailyWebTable } from '../Daily/DailyWebTable';
import { IPerformer } from '../interfaces';
import useSWR from 'swr';
import { serialize } from '@Views/Staking/utils';
import { FilterBg } from './tabFilter';
import PNLIcon from 'public/LeaderBoard/PNL';
import { useRouter } from 'next/router';
import { useGlobal } from 'Contexts/Global';
import { MAINNET_ENVS } from '@Config/index';

const DAILY_LEADERBOARD = `binary/leaderboard/?`;
const timeList = [
  { name: '24 H', offset: -1 },
  { name: '7 D', offset: 7 },
  { name: '30 D', offset: 30 },
  { name: 'ALL', offset: 0 },
];

export const PNL = () => {
  const [activeTab, setActiveTab] = useState(timeList[0]);
  const router = useRouter();
  const { state } = useGlobal();
  const isPageAvailable = MAINNET_ENVS.includes(
    state.settings.activeChain?.env
  );

  const { data: response } = useSWR<{
    options: IPerformer[];
    total_pages: number;
  }>(
    DAILY_LEADERBOARD +
      serialize({
        leaderboard_type: 'all',
        day_offset: router.query.offset || 0,
        page: getPageNumber(router),
        limit: LEADERBOARD_LIMIT,
      })
  );
  useEffect(() => {}, [router.query.offset]);

  return (
    <LeaderBoard>
      <PNLStyles>
        <TopData
          pageImage={<PNLIcon width={45} height={45} className="mt8" />}
          heading={'Profit & Loss'}
          desc={
            <div className="flex-center">
              Compete against the best for prizes.
              {/* <span
                className="flex-center light-blue-text ml6"
                onClick={() => {
                  window.open(
                    "https://docs.umaproject.org/products/KPI-options#:~:text=Key%20Performance%20Indicator%20(KPI)%20options,option%20will%20be%20worth%20more",
                    "_blank"
                  );
                }}
              >
                Learn more
                <FrontArrow className="tml" />
              </span> */}
            </div>
          }
          rightCom={
            isPageAvailable && (
              <Tabsv2
                tabs={timeList}
                activeTab={+router.query.offset || 0}
                setActiveTab={(tab) => {
                  router.replace({
                    pathname: router.pathname,
                    query: { ...router.query, offset: tab.offset },
                  });
                  setActiveTab(tab);
                }}
              />
            )
          }
        />

        <DailyWebTable res={response} shouldShowTrophy={false} />
      </PNLStyles>
    </LeaderBoard>
  );
};

interface ITabFilter {
  tabs: { name: string; offset: number }[];
  activeTab: number;
  setActiveTab?: (a: any) => void;
  className?: string;
}
const Tabsv2: React.FC<ITabFilter> = ({
  tabs,
  className,
  activeTab,
  setActiveTab,
}) => {
  return (
    <FilterBg className={className}>
      {tabs.map((child, idx) => (
        <div
          key={idx}
          className={`toggle-tab nowrap ${
            child.offset === activeTab && 'active'
          }`}
          onClick={() => setActiveTab(child)}
        >
          {child.name}
        </div>
      ))}
    </FilterBg>
  );
};
