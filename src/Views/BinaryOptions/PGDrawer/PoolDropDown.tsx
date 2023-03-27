import BufferDropdown from '@Views/Common/BufferDropdown';
import { useAtomValue, useSetAtom } from 'jotai';
import { useQTinfo } from '..';
import { useMemo } from 'react';
import { useActiveChain } from '@Hooks/useActiveChain';
import { DropdownArrow } from '@SVG/Elements/DropDownArrow';
import { atomWithLocalStorage } from '../Components/SlippageModal';

const activePoolAtom = atomWithLocalStorage('last-selected-pool-v1', {
  activePool: null,
});

export const useActivePoolObj = () => {
  const { activePool } = useAtomValue(activePoolAtom);
  const qtInfo = useQTinfo();
  const { activeChain } = useActiveChain();
  const activePair = qtInfo.activePair;

  const dropdownItems = useMemo(() => {
    if (!activePair) return [];

    return activePair.pools.map((pool) => pool.token.name);
  }, [activePair, activeChain]);

  const activePoolObj = useMemo(() => {
    if (activePool && activePair) {
      const pool = activePair.pools.find(
        (pool) => pool.token.name === activePool
      );

      if (pool) return pool;
      else return activePair.pools[0];
    } else return activePair.pools[0];
  }, [activePair, activePool, activeChain]);

  return { activePoolObj, dropdownItems };
};

export const PoolDropDown = () => {
  const setActivePool = useSetAtom(activePoolAtom);
  const { configContracts } = useActiveChain();
  const { dropdownItems, activePoolObj } = useActivePoolObj();

  if (dropdownItems.length === 1)
    return (
      <div className="token-dd flex items-center bg-cross-bg w-fit px-4 py-[5px]  sm:px-[0] sm:py-[0]  text-f16  text-1">
        <img
          src={activePoolObj.token.img}
          className="w-[18px] h-[18px] sm:w-[25px] sm:h-[25px] sm:max-w-max sm:mr-[0]  mr-2 "
        />
        <div className="sm:hidden">{activePoolObj.token.name}</div>
      </div>
    );
  return (
    <BufferDropdown
      rootClass="token-dd flex-center "
      className="bg-cross-bg dd-items text-3"
      items={dropdownItems}
      initialActive={1}
      rootClassName="token-dd w-fit"
      dropdownBox={(isActive, isOpen, d) => (
        <div className="token-dd w-fit hover:brightness-150 flex items-center bg-cross-bg px-4 py-[5px] sm:px-[0] sm:py-[0] text-f16 transition-all duration-150 text-1">
          <img
            src={activePoolObj.token.img}
            className="w-[18px] h-[18px] sm:w-[25px] sm:h-[25px] sm:max-w-max sm:mr-[0]  mr-2 "
          />
          <div className="sm:hidden">{activePoolObj.token.name}</div>
          <DropdownArrow open={isOpen} />
        </div>
      )}
      item={(singleItem, handleClose, onChange, activel) => (
        <button
          className="hover:brightness-150 mt-2 flex items-center sm:p-2 sm:justify-center"
          onClick={() => {
            setActivePool({ activePool: singleItem });
          }}
          key={singleItem}
        >
          <img
            src={configContracts.tokens[singleItem].img}
            className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] sm:max-w-max sm:mr-[0] mr-2 "
          />{' '}
          <div className="sm:hidden">{singleItem}</div>
        </button>
      )}
    />
  );
};
