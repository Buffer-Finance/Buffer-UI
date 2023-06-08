import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { useRef } from 'react';
import { AssetSelectorDD } from '../Markets/AssetSelectorDD';
import { DDarrow } from '@Views/TradePage/Components/DDarrow';
import { joinStrings } from '@Views/TradePage/utils';

export const MarketSelectorDD: React.FC<{ token0: string; token1: string }> = ({
  token0,
  token1,
}) => {
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);

  function closeDropdown() {
    toggleMenu(false);
  }

  return (
    <>
      <button className="flex items-center" ref={ref} {...anchorProps}>
        {' '}
        <div className="w-[24px] h-[24px]">
          <PairTokenImage pair={joinStrings(token0, token1, '-')} />
        </div>
        <h2 className="ml-[10px] text-[19px]">
          {joinStrings(token0, token1, '/')}
        </h2>
        <DDarrow open={menuState.state === 'open'} className="scale-150 ml-3" />
      </button>
      <ControlledMenu
        {...menuState}
        anchorRef={ref}
        onClose={closeDropdown}
        viewScroll="initial"
        direction="bottom"
        position="initial"
        align="start"
        menuClassName={'!p-[0] !rounded-[10px] hover:!rounded-[10px]'}
        offsetY={10}
      >
        <MenuItem
          className={({ hover }) => {
            return `!p-[0] ${hover ? '!rounded-[10px]' : ''}`;
          }}
          onClick={(e: ClickEvent) => {
            e.keepOpen = true;
          }}
        >
          <AssetSelectorDD />
        </MenuItem>
      </ControlledMenu>
    </>
  );
};
