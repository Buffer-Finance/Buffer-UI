import { ColumnGap } from '@Views/TradePage/Components/Column';
import styled from '@emotion/styled';
import { SearchBar } from './SearchBar';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { CategoryTabs } from './CategoryTabs';
import { PoolRadio } from './PoolRadio';
import { AssetSelectorTable } from './AssetSelectorTable';

const AssetSelectorDDBackground = styled.div`
  max-height: 420px;
  width: 100%;
  padding: 16px;
  background-color: #232334;
`;

export const AssetSelectorDD: React.FC = () => {
  return (
    <AssetSelectorDDBackground>
      <ColumnGap gap="16px">
        <SearchBar />
        <RowBetween>
          <CategoryTabs />
          <PoolRadio />
        </RowBetween>
        <AssetSelectorTable />
      </ColumnGap>
    </AssetSelectorDDBackground>
  );
};
