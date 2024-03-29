import { selectedExpiry, selectedPriceAtom } from '@Views/AboveBelow/atoms';
import { DDarrow } from '@Views/ABTradePage/Components/DDarrow';
import { RowGap } from '@Views/ABTradePage/Components/Row';
import styled from '@emotion/styled';
import {
  ClickEvent,
  Menu,
  MenuButton,
  MenuItem as MenuItemInner,
  MenuItemProps,
} from '@szhsin/react-menu';
import { useAtom } from 'jotai';
import { formatDateWithTime, getTimestamps } from './helpers';

export const DropDown = () => {
  const [selectedTimestamp, setSelectedTimestamp] = useAtom(selectedExpiry);
  const [selectedStrike, setSelectedStrike] = useAtom(selectedPriceAtom);

  function onClick(e: ClickEvent) {
    e.stopPropagation = true;
    setTimeout(() => {
      const priceline = document.getElementById('current-price-line');
      console.log(`Dropdown-priceline: `, priceline);
      priceline?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }, 700);

    setSelectedTimestamp(e.value);

    setSelectedStrike(undefined);
  }
  const timestamps = getTimestamps();
  return (
    <MenuBackground>
      <Menu
        menuButton={({ open }) => {
          return (
            <MenuButton
              className={`!bg-[#282B39] px-5 pl-6 !w-full rounded-[2px] py-2 text-f14 text-[#C3C2D4]  font-medium`}
            >
              <RowGap gap="8px" className="w-full">
                {selectedTimestamp
                  ? formatDateWithTime(selectedTimestamp)
                  : 'Select Expiry (UTC)'}
                <DDarrow open={open} className="scale-125 ml-5" />
              </RowGap>
            </MenuButton>
          );
        }}
        position="auto"
        align="center"
        menuClassName={'!w-fit !bg-[#282B39] '}
        offsetY={5}
      >
        {timestamps.map((timestamp) => {
          return (
            <MenuItem onClick={onClick} value={timestamp}>
              {formatDateWithTime(timestamp)}
            </MenuItem>
          );
        })}
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
  `px-3 !w-full focus:outline-none text-f13 text-[#c3c2d4] ${
    disabled && 'text-gray-400'
  } ${hover && 'my-menuitem-hover'}}`;

const MenuItem = (props: MenuItemProps) => (
  <MenuItemInner
    {...props}
    className={menuItemClassName}
    onClick={props.onClick}
  />
);

const MenuBackground = styled.div`
  .szh-menu-container {
    width: 95%;
  }
  .szh-menu__item--hover {
    color: #ffffff;
    background-color: transparent;
  }
`;
