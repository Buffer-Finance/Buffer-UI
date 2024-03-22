import DDArrow from '@SVG/Elements/Arrow';
import {
  aboveBelowMarketsAtom,
  activeCategoryAtom,
  searchBarAtom,
} from '@Views/AboveBelow/atoms';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { PoolRadio } from '../../StatusBar/AssetSelector/PoolRadio';
import { Table } from '../../StatusBar/AssetSelector/Table';

export const MobileAccordionTable = () => {
  const markets = useAtomValue(aboveBelowMarketsAtom);
  const assetTypes = useMemo(() => {
    if (markets === null) {
      return [];
    }
    const categories = markets.map((market) => market.category);
    return ['favourites', 'all', ...new Set(categories)];
  }, [markets]);
  const searchValue = useAtomValue(searchBarAtom);

  const [activeAsset, setActiveAsset] = useAtom(activeCategoryAtom);

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
                  {searchValue.length > 0 ? null : (
                    <DDArrow
                      className={` transition-all duration-300  ease-out scale-125  ${
                        child === activeAsset && ' rotate-180 '
                      } `}
                    />
                  )}
                </div>
              </div>
              {!idx && <PoolRadio />}
            </div>
            {child === activeAsset || searchValue.length > 0 ? (
              <Table group={child} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
};
