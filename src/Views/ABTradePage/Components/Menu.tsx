import {
  Menu as MenuInner,
  MenuState,
  MenuProps,
  MenuItem,
} from '@szhsin/react-menu';

export const CommonMenu: React.FC<{
  MenuButton: JSX.Element;
  DD: JSX.Element;
}> = ({ MenuButton, DD }) => {
  return (
    <MenuInner menuButton={MenuButton}>
      <MenuItem>m</MenuItem>
      <MenuItem>h</MenuItem>
    </MenuInner>
  );
};

const menuClassName = ({ state }: { state: MenuState }) =>
  `box-border z-50 text-sm bg-white p-1.5 border rounded-md shadow-lg select-none focus:outline-none min-w-[9rem] ${
    state === 'opening' && 'animate-fadeIn'
  } ${state === 'closing' && 'animate-fadeOut'}`;

const Menu = (props: MenuProps) => (
  <MenuInner {...props} menuClassName={menuClassName} />
);
