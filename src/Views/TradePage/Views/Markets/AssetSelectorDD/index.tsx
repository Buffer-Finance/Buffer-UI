import { ColumnGap } from '@Views/TradePage/Components/Column';
import styled from '@emotion/styled';
import { SearchBar } from './SearchBar';
import { RowBetween } from '@Views/TradePage/Components/Row';
import { CategoryTabs } from './CategoryTabs';
import { PoolRadio } from './PoolRadio';
import { AssetSelectorTable } from './AssetSelectorTable';
import { useAtom, useAtomValue } from 'jotai';
import { categoriesAtom, searchBarAtom } from '@Views/TradePage/atoms';
import { useCategories } from '@Views/TradePage/Hooks/useCategories';
import DDArrow from '@SVG/Elements/Arrow';
import { useEffect } from 'react';

const AssetSelectorDDBackground = styled.div`
  max-height: 420px;
  width: 100%;
  padding: 16px;
  background-color: #232334;
`;

export const AssetSelectorDD: React.FC<{ isMobile: boolean }> = ({
  isMobile,
}) => {
  return (
    <AssetSelectorDDBackground>
      <ColumnGap gap="16px">
        <SearchBar />
        {!isMobile && (
          <RowBetween>
            <CategoryTabs />
            <PoolRadio />
          </RowBetween>
        )}
        {isMobile ? <MobileAccordionTable /> : <AssetSelectorTable />}
      </ColumnGap>
    </AssetSelectorDDBackground>
  );
};

const MobileAccordionTable = () => {
  const { categories: assetTypes } = useCategories();
  const searchValue = useAtomValue(searchBarAtom);

  const [activeAsset, setActiveAsset] = useAtom(categoriesAtom);
  useEffect(() => {
    setActiveAsset('Crypto');
    return () => setActiveAsset('Crypto');
  }, []);
  return (
    <ol className="flex flex-col gap-y-[20px]">
      {assetTypes.map((child, idx) => {
        // while search, favourites are already have star in there respected catagory
        if (searchValue.length > 0 && child == 'favourites') return null;
        return (
          <li key={idx}>
            <div className="flex items-center justify-between">
              <div
                className={`bg-[#282B39] capitalize  text-f14 py-1 px-3 w-fit ${
                  child === activeAsset && ' '
                }`}
                role="button"
                onClick={() => {
                  if (activeAsset === child) {
                    setActiveAsset('no-select');
                  } else setActiveAsset(child);
                }}
              >
                <div className="flex gap-x-3 items-center">
                  {child}
                  <DDArrow
                    className={` transition-all duration-300  ease-out scale-125  ${
                      child === activeAsset && ' rotate-180 '
                    } `}
                  />
                </div>
              </div>
              {!idx && <PoolRadio />}
            </div>
            {child === activeAsset || searchValue.length > 0 ? (
              <AssetSelectorTable group={child} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
};
