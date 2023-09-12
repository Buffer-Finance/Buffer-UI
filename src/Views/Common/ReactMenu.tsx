import { ControlledMenu, useClick, useMenuState } from '@szhsin/react-menu';
import { useRef } from 'react';

export const ReactMenu: React.FC<{
  MenuHeader: JSX.Element;
  MenuOptions: JSX.Element;
  MenuClassName?: string;
}> = ({ MenuHeader, MenuOptions, MenuClassName = '' }) => {
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
        {MenuHeader}
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
        menuClassName={MenuClassName}
        offsetY={10}
      >
        {MenuOptions}
      </ControlledMenu>
    </>
  );
};
