import HorizontalTransition from '@Views/Common/Transitions/Horizontal';
import { graphsType, poolsType } from '@Views/LpRewards/types';
import React, { useMemo, useState } from 'react';
import { Chain } from 'viem';
import { GraphTabs } from './GraphTabs';
import { PriceChart } from './PriceChart';
import { ProfitLossChart } from './ProfitLossChart';
import { TVLChart } from './TVLchart';

export const Graphs: React.FC<{
  activeChain: Chain;
  activePool: poolsType;
}> = ({ activeChain, activePool }) => {
  const [activeTab, setActiveTab] = useState<graphsType>('price');
  const activeTabNumber = useMemo(() => {
    return activeTab === 'price'
      ? 0
      : activeTab === 'tvl'
      ? 1
      : // : activeTab === 'apr'
        // ? 2
        3;
  }, [activeTab]);

  return (
    <div className="p-6 bg-[#171722]">
      <GraphTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePool={activePool}
      />
      <HorizontalTransition value={activeTabNumber}>
        <PriceChart activeChain={activeChain} activePool={activePool} />
        <TVLChart activeChain={activeChain} activePool={activePool} />
        <></>
        <ProfitLossChart activeChain={activeChain} activePool={activePool} />
      </HorizontalTransition>
    </div>
  );
};
