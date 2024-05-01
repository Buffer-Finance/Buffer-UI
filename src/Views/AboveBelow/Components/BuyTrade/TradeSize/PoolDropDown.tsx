import {
  aboveBelowActiveMarketsAtom,
  selectedPoolActiveMarketAtom,
  setSelectedPoolForTradeAtom,
} from '@Views/AboveBelow/atoms';
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
import { useAtomValue, useSetAtom } from 'jotai';

export const PoolDropdown: React.FC = () => {
  const markets = useAtomValue(aboveBelowActiveMarketsAtom);
  console.log(`PoolDropDown-markets: `, markets);
  const setActivePoolMarket = useSetAtom(setSelectedPoolForTradeAtom);
  const selectedPoolMarket = useAtomValue(selectedPoolActiveMarketAtom);

  function onClick(e: ClickEvent) {
    setActivePoolMarket(e.value);
  }

  return (
    // <MenuBackground>
    <Menu
      menuButton={({ open }) => {
        return (
          <MenuButton
            className={
              '!bg-[#303044] rounded-r-[5px] py-2 text-f14 text-1 px-3 font-medium h-[40px] sm:h-[35px]'
            }
          >
            <RowGap gap="8px">
              {selectedPoolMarket?.poolInfo.token.toUpperCase()}
              <DDarrow open={open} className="scale-150" />
            </RowGap>
          </MenuButton>
        );
      }}
      position="auto"
      align="center"
      menuClassName={'!w-fit !min-w-[0px] !bg-[#303044]'}
      offsetY={5}
    >
      {markets ? (
        markets.map((market) => (
          <MenuItem
            onClick={onClick}
            value={market.poolInfo.token.toUpperCase()}
            key={market.poolInfo.token.toUpperCase()}
          >
            {market.poolInfo.token.toUpperCase()}
          </MenuItem>
        ))
      ) : (
        <></>
      )}
    </Menu>
    // </MenuBackground>
  );
};

const menuItemClassName = ({
  disabled,
  hover,
}: {
  disabled: boolean;
  hover: boolean;
}) =>
  `px-3 text-f12 focus:outline-none text-[#c3c2d4] ${
    disabled && 'text-gray-400'
  } ${hover && ''}}`;

const MenuItem = (props: MenuItemProps) => (
  <MenuBackground>
    <MenuItemInner
      {...props}
      className={menuItemClassName}
      onClick={props.onClick}
    />
  </MenuBackground>
);

const MenuBackground = styled.div`
  height: 100%;
  .szh-menu__item--hover {
    color: #ffffff;
    background-color: transparent;
  }
`;
