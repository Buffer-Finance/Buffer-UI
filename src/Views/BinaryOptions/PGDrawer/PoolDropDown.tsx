import BufferDropdown from '@Views/Common/BufferDropdown';
import DDIcon from 'src/SVG/Elements/DDIcon';
import { atom, useAtom } from 'jotai';
import { useQTinfo } from '..';
import { useEffect, useMemo } from 'react';
import { useActiveChain } from '@Hooks/useActiveChain';

const activePoolAtom = atom<{ activePool: string | null }>({
  activePool: null,
});

export const useActivePoolObj = () => {
  const [{ activePool }, setActivePool] = useAtom(activePoolAtom);
  const qtInfo = useQTinfo();
  const activePair = qtInfo.activePair;

  const dropdownItems = useMemo(() => {
    if (!activePair) return [];

    return activePair.pools.map((pool) => pool.token.name);
  }, [activePair]);

  useEffect(() => {
    setActivePool({ activePool: dropdownItems[0] });
  }, [activePair]);

  const activePoolObj = useMemo(() => {
    if (activePool && activePair) {
      const pool = activePair.pools.find(
        (pool) => pool.token.name === activePool
      );
      console.log(pool, activePair, activePool, 'pool');
      if (pool) return pool;
      else return activePair.pools[0];
    } else return activePair.pools[0];
  }, [activePair, activePool]);

  return { activePoolObj, dropdownItems };
};

export const PoolDropDown = () => {
  const [{ activePool }, setActivePool] = useAtom(activePoolAtom);
  const { configContracts } = useActiveChain();

  const { dropdownItems } = useActivePoolObj();
  if (dropdownItems.length === 1)
    return (
      <div className="token-dd flex items-center bg-cross-bg w-fit px-4 py-[5px] text-f16  text-1">
        <img
          src={activePool && configContracts.tokens[activePool].img}
          className="w-[18px] h-[18px]  mr-2 "
        />
        {activePool}
      </div>
    );
  return (
    <BufferDropdown
      rootClass="token-dd flex-center "
      className="bg-cross-bg dd-items text-3 "
      items={dropdownItems}
      initialActive={1}
      rootClassName="token-dd w-fit"
      dropdownBox={(isActive, isOpen, d) => (
        <div className="token-dd w-fit hover:brightness-150 flex items-center bg-cross-bg px-4 py-[5px] text-f16 transition-all duration-150 text-1">
          <img
            src={activePool && configContracts.tokens[activePool].img}
            className="w-[18px] h-[18px]  mr-2 "
          />
          {activePool}
          <DDIcon
            className={`ml-[9px] w-[26px] h-[8px] ${
              isOpen ? 'origin rotate-180' : ''
            }`}
          />
        </div>
      )}
      item={(singleItem, handleClose, onChange, activel) => (
        <button
          className="hover:brightness-150 mt-2 flex items-center"
          onClick={() => {
            setActivePool({ activePool: singleItem });
          }}
          key={singleItem}
        >
          <img
            src={activePool && configContracts.tokens[singleItem].img}
            className="w-[18px] h-[18px] mr-2 "
          />
          {singleItem}
        </button>
      )}
    />
  );
};
