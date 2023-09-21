import { Settings } from '@Views/TradePage/Views/Settings';
import {
  ClickEvent,
  ControlledMenu,
  MenuItem,
  useClick,
  useMenuState,
} from '@szhsin/react-menu';
import { useRef } from 'react';
import { SettingsIcon } from './SettingsIcon';

export const SettingsDD: React.FC = () => {
  const ref = useRef(null);
  const [menuState, toggleMenu] = useMenuState({ transition: true });
  const anchorProps = useClick(menuState.state, toggleMenu);

  function closeDropdown() {
    toggleMenu(false);
  }

  return (
    <>
      <button
        type="button"
        ref={ref}
        {...anchorProps}
        test-id="setting-button-click"
      >
        <SettingsIcon className="hover:brightness-125 transition-all duration-100 ease-in-out" />
      </button>
      <ControlledMenu
        {...menuState}
        anchorRef={ref}
        onClose={closeDropdown}
        viewScroll="initial"
        direction="bottom"
        position="anchor"
        align="end"
        portal
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
          <Settings closeDropdown={closeDropdown} />
        </MenuItem>
      </ControlledMenu>
    </>
  );
};
