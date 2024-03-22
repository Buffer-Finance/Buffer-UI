import { DDarrow } from '@Views/TradePage/Components/DDarrow';
import { RowGap } from '@Views/TradePage/Components/Row';
import styled from '@emotion/styled';
import {
  ClickEvent,
  Menu,
  MenuButton,
  MenuItem as MenuItemInner,
  MenuItemProps,
} from '@szhsin/react-menu';
import { useEffect, useState } from 'react';

export const MHdropDown: React.FC<{
  activeFrame: string;
  setFrame: (newFrame: string) => void;
  className?: string;
  shouldKeepOpen?: boolean;
  onClickFunction?: (frame: string | undefined) => void;
}> = ({
  activeFrame,
  setFrame,
  shouldKeepOpen = false,
  className = '',
  onClickFunction,
}) => {
  const [selectedItem, setSelectedItem] = useState<string | undefined>(
    undefined
  );
  function onClick(e: ClickEvent) {
    e.stopPropagation = true;
    e.keepOpen = shouldKeepOpen;
    setFrame(e.value);
    setSelectedItem(e.value);
  }

  useEffect(() => {
    if (onClickFunction) onClickFunction(selectedItem);
  }, [selectedItem]);

  return (
    <MenuBackground>
      <Menu
        menuButton={({ open }) => {
          return (
            <MenuButton
              className={`${className} !bg-[#1c1c28] rounded-[2px] py-2 text-f12 text-[#C3C2D4] px-3 font-medium`}
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
    </MenuBackground>
  );
};

const menuItemClassName = ({
  disabled,
  hover,
}: {
  disabled: boolean;
  hover: boolean;
}) =>
  `px-3 focus:outline-none text-[#c3c2d4] ${disabled && 'text-gray-400'} ${
    hover && 'my-menuitem-hover'
  }}`;

const MenuItem = (props: MenuItemProps) => (
  <MenuItemInner
    {...props}
    className={menuItemClassName}
    onClick={props.onClick}
  />
);

const MenuBackground = styled.div`
  .szh-menu__item--hover {
    color: #ffffff;
    background-color: transparent;
  }
`;
