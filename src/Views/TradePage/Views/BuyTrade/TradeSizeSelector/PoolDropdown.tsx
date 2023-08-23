import { DDarrow } from '@Views/TradePage/Components/DDarrow';
import { RowGap } from '@Views/TradePage/Components/Row';
import { useActivePoolObject } from '@Views/TradePage/Hooks/useActivePoolObject';
import { activePoolObjAtom } from '@Views/TradePage/atoms';
import styled from '@emotion/styled';
import {
  Menu,
  MenuButton,
  MenuItemProps,
  MenuItem as MenuItemInner,
  ClickEvent,
} from '@szhsin/react-menu';
import { useAtom } from 'jotai';

export const PoolDropdown: React.FC = () => {
  const [{ activePool }, setActivePool] = useAtom(activePoolObjAtom);
  const { poolNameList } = useActivePoolObject();

  function onClick(e: ClickEvent) {
    setActivePool({ activePool: e.value });
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
              {activePool}
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
      {poolNameList ? (
        poolNameList.map((poolName) => (
          <MenuItem onClick={onClick} value={poolName} key={poolName}>
            {poolName}
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
