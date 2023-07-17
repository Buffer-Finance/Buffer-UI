import BufferDropdown from '@Views/Common/BufferDropdown';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useQTinfo } from '..';
import { useMemo } from 'react';
import { useActiveChain } from '@Hooks/useActiveChain';
import { DropDownArrowSm, DropdownArrow } from '@SVG/Elements/DropDownArrow';
import { useV3ActivePoolObj } from '@Views/V3App/Utils/useSwitchPoolForTrade';
import { v3AppConfig } from '@Views/V3App/config';
import { atomWithStorage } from 'jotai/utils';

const activePoolAtom = atomWithStorage('last-selected-pool-v1', {
  activePool: null,
});
const activePoolALlAtom = atom({
  activePool: 'USDC',
});

export const useActivePoolObj = () => {
  const { activePool } = useAtomValue(activePoolAtom);
  const qtInfo = useQTinfo();
  const { activeChain } = useActiveChain();
  const activePair = qtInfo.activePair;
  const defaultPool = activePair.pools.filter((pool) => !pool.token.is_pol)[0];

  const dropdownItems = useMemo(() => {
    if (!activePair) return [];

    return activePair.pools
      .filter((pool) => !pool.token.is_pol)
      .map((pool) => pool.token.name);
  }, [activePair, activeChain]);

  const activePoolObj = useMemo(() => {
    if (activePool && activePair) {
      const pool = activePair.pools.find(
        (pool) => pool.token.name === activePool && !pool.token.is_pol
      );

      if (pool) return pool;
      else return defaultPool;
    } else return defaultPool;
  }, [activePair, activePool, activeChain]);
  // console.log(activePoolObj, 'activePoolObj');
  return { activePoolObj, dropdownItems };
};
export const useActivePoolAll = () => {
  const { activePool } = useAtomValue(activePoolALlAtom);
  const qtInfo = useQTinfo();
  const { activeChain, configContracts } = useActiveChain();
  const activePair = qtInfo.activePair;

  const dropdownItems = useMemo(() => {
    if (!activePair) return [];

    console.log(`activePair.pools: `, activePair.pools);
    return (
      activePair.pools
        // .filter((pool) => !pool.token.is_pol)
        .map((pool) => pool.token.name)
    );
  }, [activePair, activeChain]);

  console.log(`dropdownItems: `, dropdownItems);
  const activePoolObj = useMemo(() => {
    console.log(
      `configContracts.tokens[activePool]: `,
      configContracts.tokens[activePool]
    );
    let name = activePool;
    const poolObj = { token: { ...configContracts.tokens[activePool], name } };
    return poolObj;
  }, [activePool, configContracts]);

  return { activePoolObj, dropdownItems };
};
export function getImageUrl(tokenName: string) {
  return `https://res.cloudinary.com/dtuuhbeqt/image/upload/v1684085945/${tokenName}.png`;
}
export const PoolDropDown = () => {
  const setActivePool = useSetAtom(activePoolAtom);
  const { activeChain } = useActiveChain();
  const configData =
    v3AppConfig[activeChain.id as unknown as keyof typeof v3AppConfig];
  const { poolNameList: dropdownItems, activePoolObj } = useV3ActivePoolObj();
  const activeToken = configData.poolsInfo[activePoolObj?.pool]?.token;

  if (activePoolObj === null || dropdownItems === null) return <></>;
  if (dropdownItems.length === 1)
    return (
      <div className="token-dd flex items-center bg-cross-bg w-fit px-4 py-[5px]  sm:px-[0] sm:py-[0]  text-f16  text-1">
        <img
          src={getImageUrl(activeToken)}
          className="w-[18px] h-[18px] sm:w-[25px] sm:h-[25px] sm:max-w-max sm:mr-[0]  mr-2 "
        />
        <div className="sm:hidden">{activeToken}</div>
      </div>
    );
  return (
    <BufferDropdown
      rootClass="token-dd flex-center h-full "
      className="bg-[#303044] dd-items text-3 chain-dropdown-bottom mb-3"
      items={dropdownItems}
      initialActive={1}
      rootClassName="token-dd w-fit"
      dropdownBox={(isActive, isOpen, d) => (
        <div className="token-dd w-fit hover:brightness-150 flex items-center bg-[#303044] px-4 py-[5px] sm:px-[0] sm:py-[0] text-f14 transition-all duration-150 text-1">
          <img
            src={getImageUrl(activeToken)}
            className="w-[18px] h-[18px] sm:w-[25px] sm:h-[25px] sm:max-w-max sm:mr-[0]  mr-2 "
          />
          <div className="sm:hidden">{activeToken}</div>
          <DropDownArrowSm open={isOpen} className="ml-2" />
        </div>
      )}
      item={(singleItem: string, handleClose, onChange, activel) => {
        return (
          <button
            className="hover:brightness-150 mt-2 flex items-center sm:p-2 sm:justify-center"
            onClick={() => {
              setActivePool({ activePool: singleItem });
            }}
            key={singleItem}
          >
            <img
              src={getImageUrl(singleItem)}
              className="w-[18px] h-[18px] sm:w-[23px] sm:h-[23px] sm:max-w-max sm:mr-[0] mr-2 "
            />{' '}
            <div className="sm:hidden">{singleItem}</div>
          </button>
        );
      }}
    />
  );
};
export const PoolDropDownAll = () => {
  const setActivePool = useSetAtom(activePoolALlAtom);
  const { configContracts } = useActiveChain();
  console.log(`configContracts: `, configContracts);
  const { dropdownItems, activePoolObj } = useActivePoolAll();

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
      className="bg-cross-bg dd-items text-3 chain-dropdown-bottom mb-3"
      items={Object.keys(configContracts.tokens)}
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
