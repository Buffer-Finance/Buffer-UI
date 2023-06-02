import TabList from '@Views/Common/TabList';
import styled from '@emotion/styled';
import { useState } from 'react';

const TradeTypeSelectorBackground = styled.div`
  margin-top: 7px;
`;
export const TradeTypeSelector: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Market');
  const handleChange = (index: string) => {
    setActiveTab(index);
  };
  return (
    <TradeTypeSelectorBackground>
      <TabList
        tabs={['Market', 'Limit']}
        setActiveTab={handleChange}
        activeTab={activeTab}
      />
    </TradeTypeSelectorBackground>
  );
};
