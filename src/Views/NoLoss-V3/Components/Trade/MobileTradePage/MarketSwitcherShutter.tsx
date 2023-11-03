import DDArrow from '@SVG/Elements/Arrow';
import {
  noLossActiveCategoyAtom,
  noLossSearchBarAtom,
  nolossmarketsAtom,
} from '@Views/NoLoss-V3/atoms';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { AssetSelectorDDBackground } from '../MiddleSection/StatusBar/AssetSelector/DropDown';
import { SearchBar } from '../MiddleSection/StatusBar/AssetSelector/SearchBar';
import { Table } from '../MiddleSection/StatusBar/AssetSelector/Table';

export const MarketSwitcherShutter = () => {
  const searchValue = useAtomValue(noLossSearchBarAtom);
  const [activeAsset, setActiveAsset] = useAtom(noLossActiveCategoyAtom);
  const markets = useAtomValue(nolossmarketsAtom);
  const categories = useMemo(() => {
    if (markets === undefined) {
      return [];
    }
    const categories = markets.map((market) => market.chartData.category);
    return ['favourites', 'all', ...new Set(categories)];
  }, [markets]);

  return (
    <AssetSelectorDDBackground>
      <ColumnGap gap="16px">
        <SearchBar />
        <ol className="flex flex-col gap-y-[20px]">
          {categories.map((child, idx) => {
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
                      {searchValue.length > 0 ? null : (
                        <DDArrow
                          className={` transition-all duration-300  ease-out scale-125  ${
                            child === activeAsset && ' rotate-180 '
                          } `}
                        />
                      )}
                    </div>
                  </div>
                </div>
                {child === activeAsset || searchValue.length > 0 ? (
                  <Table group={child} />
                ) : null}
              </li>
            );
          })}
        </ol>{' '}
      </ColumnGap>
    </AssetSelectorDDBackground>
  );
};
