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
import { isExpiryStale } from '@TV/utils';
import { getDistance, Variables } from '@Utils/Time';
import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { ArrowDropDownRounded } from '@mui/icons-material';
import { cn } from '@Utils/cn';

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
  const staleExpiry = isExpiryStale(selectedTimestamp);
  return (
    <MenuBackground>
      <Menu
        transition
        menuButton={({ open }) => {
          return (
            <MenuButton
              className={
                (staleExpiry ? 'wrong-selection' : '') +
                ` !bg-[#282b3996] hover:brightness-125 px-5 pl-6 !w-full rounded-[10px] dd-border py-2 text-f14 text-[#C3C2D4]  font-medium `
              }
            >
              <RowGap gap="8px" className="w-full">
                {selectedTimestamp
                  ? `${formatDateWithTime(selectedTimestamp)} (${formatDistance(
                      Variables(getDistance(+selectedTimestamp / 1000))
                    )})`
                  : 'Select Expiry (UTC)'}
                <ArrowDropDownRounded
                  className={cn(
                    'scale-150 ml-2 transition-transform',
                    open && 'rotate-180'
                  )}
                />
              </RowGap>
            </MenuButton>
          );
        }}
        position="auto"
        align="center"
        menuClassName={'!w-fit !bg-[#22242e] '}
        offsetY={5}
      >
        {timestamps.map((timestamp) => {
          return (
            <MenuItem key={timestamp} onClick={onClick} value={timestamp}>
              {formatDateWithTime(timestamp)}
              {`  (${formatDistance(
                Variables(getDistance(+timestamp / 1000))
              )})`}
              {/* {getDistance(Math.ceil(+timestamp / 1000))} */}
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
  checked,
}: {
  disabled: boolean;
  hover: boolean;
  checked: boolean;
}) =>
  `px-3 !w-full focus:outline-none  text-f13 text-[#c3c2d4]  font-medium ${
    disabled && 'text-gray-400'
  } ${(checked || hover) && 'my-menuitem-hover !bg-blue font-bold '}}`;

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
