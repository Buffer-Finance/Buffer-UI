import { aboveBelowMarketsAtom } from '@Views/AboveBelow/atoms';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { RowBetween } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { CategoryTabs } from './CategoryTabs';
import { PoolRadio } from './PoolRadio';
import { SearchBar } from './SearchBar';
import { Table } from './Table';

export const AssetSelectorDDBackground = styled.div`
  max-height: 420px;
  width: 100%;
  padding: 16px;
  background-color: #232334;

  @media (max-width: 1200px) {
    background-color: transparent;
  }
`;

export const DropDown: React.FC<{
  isMobile?: boolean;
  onMarketSelect?: () => void;
}> = ({ isMobile, onMarketSelect }) => {
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const categories = useMemo(() => {
    if (markets === null) {
      return [];
    }
    const categories = markets.map((market) => market.category);
    return ['favourites', 'all', ...new Set(categories)];
  }, [markets]);

  return (
    <AssetSelectorDDBackground>
      <ColumnGap gap="16px">
        <SearchBar />
        {!isMobile && (
          <RowBetween>
            <CategoryTabs categories={categories} />
            <PoolRadio />
          </RowBetween>
        )}

        <Table onMarketSelect={onMarketSelect} />
      </ColumnGap>
    </AssetSelectorDDBackground>
  );
};
