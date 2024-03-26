import { DDarrow } from '@Views/ABTradePage/Components/DDarrow';
import { PairTokenImage } from '@Views/ABTradePage/Views/PairTokenImage';
import { joinStrings } from '@Views/ABTradePage/utils';
import { Skeleton } from '@mui/material';
import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { useRef } from 'react';
import { DropDown } from './DropDown';

export const AssetSelector: React.FC<{
  token0: string | undefined;
  token1: string | undefined;
}> = ({ token0, token1 }) => {
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);

  function closeDropdown() {
    toggleMenu(false);
  }

  if (!token0 || !token1) return <Skeleton className="w-[100px] !h-7 lc " />;

  return (
    <>
      <button className="flex items-center" ref={ref} {...anchorProps}>
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
          <DropDown onMarketSelect={closeDropdown} />
        </MenuItem>
      </ControlledMenu>
    </>
  );
};
