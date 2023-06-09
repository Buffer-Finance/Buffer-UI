import { BuyTradeTabList } from '@Views/TradePage/Components/BuyTradeTabList';
import { tradeTypeAtom } from '@Views/TradePage/atoms';
import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import { useState } from 'react';

const TradeTypeSelectorBackground = styled.div`
  margin-top: 7px;
`;
export const TradeTypeSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useAtom(tradeTypeAtom);
  const handleChange = (index: string) => {
    setActiveTab(index);
  };
  return (
    <TradeTypeSelectorBackground>
      <BuyTradeTabList
        tabs={['Market', 'Limit']}
        setActiveTab={handleChange}
        activeTab={activeTab}
      />
    </TradeTypeSelectorBackground>
  );
};
