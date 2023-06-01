import { DDarrow } from '@Views/TradePage/Components/DDarrow';
import { RowGap } from '@Views/TradePage/Components/Row';
import {
  ClickEvent,
  Menu,
  MenuButton,
  MenuItem as MenuItemInner,
  MenuItemProps,
} from '@szhsin/react-menu';

export const MHdropDown: React.FC<{
  activeFrame: string;
  setFrame: (newFrame: string) => void;
}> = ({ activeFrame, setFrame }) => {
  function onClick(e: ClickEvent) {
    setFrame(e.value);
  }

  return (
    <Menu
      menuButton={({ open }) => {
        return (
          <MenuButton
            className={
              '!bg-[#1c1c28] rounded-[2px] py-2 text-f12 text-[#C3C2D4] px-3 font-medium'
            }
          >
            <RowGap gap="4px">
              {activeFrame}
              <DDarrow open={open} />
            </RowGap>
          </MenuButton>
        );
      }}
      position="auto"
      align="center"
      menuClassName={'!w-fit !min-w-[0px] !bg-[#1c1c28]'}
      offsetY={5}
    >
      <MenuItem onClick={onClick} value={'m'}>
        m
      </MenuItem>
      <MenuItem onClick={onClick} value={'h '}>
        h
      </MenuItem>
    </Menu>
  );
};

const menuItemClassName = ({
  disabled,
  hover,
}: {
  disabled: boolean;
  hover: boolean;
}) =>
  `px-3  focus:outline-none text-[#c3c2d4] ${disabled && 'text-gray-400'} ${
    hover && ''
  }}`;

const MenuItem = (props: MenuItemProps) => (
  <MenuItemInner
    {...props}
    className={menuItemClassName}
    onClick={props.onClick}
  />
);
