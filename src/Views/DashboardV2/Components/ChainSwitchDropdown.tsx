import { useActiveChain } from '@Hooks/useActiveChain';
import DropdownArrow from '@SVG/Elements/DropDownArrow';
import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';
import { chainImageMappipng } from '@Views/Common/Navbar/chainDropdown';
import { useLocation, useNavigate } from 'react-router-dom';
import { getChains } from 'src/Config/wagmiClient';

export const ChainSwitchDropdown = ({
  baseUrl,
  classes = {
    imgDimentions: 'h-[22px] w-[22px] ',
    fontSize: 'text-f15',
    itemFontSize: 'text-f14',
    verticalPadding: 'py-[6px]',
  },
}: {
  baseUrl: string;
  classes?: {
    imgDimentions: string;
    fontSize: string;
    itemFontSize: string;
    verticalPadding: string;
  };
}) => {
  const { activeChain } = useActiveChain();
  const tabList = getChains();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <BufferDropdown
      rootClass="w-fit m-auto"
      className="py-4 px-4 bg-2 !w-max"
      dropdownBox={(a, open, disabled) => (
        <div
          className={`flex items-center justify-between ${classes.fontSize} font-medium bg-[#2c2c41] pl-3 pr-[0] ${classes.verticalPadding} rounded-sm text-1`}
        >
          <div className="flex items-center">
            <img
              src={
                chainImageMappipng[
                  activeChain.name as keyof typeof chainImageMappipng
                ]
              }
              className={`${classes.imgDimentions} mr-[6px] rounded-full`}
            />
            {activeChain.name}
          </div>
          <DropdownArrow open={open} />
        </div>
      )}
      items={tabList}
      item={(tab, handleClose, onChange, isActive, index) => {
        let navigationUrl = `${baseUrl}/${tab.name}`;
        if (location.search !== '') {
          navigationUrl = navigationUrl + location.search;
        }
        return (
          <div
            key={tab.name}
            className={`${classes.itemFontSize} whitespace-nowrap ${
              index === tabList.length - 1 ? '' : 'pb-[6px]'
            } ${index === 0 ? '' : 'pt-[6px]'} ${
              activeChain.name === tab.name ? 'text-1' : 'text-2'
            }`}
            onClick={() => navigate(navigationUrl)}
          >
            <div className="flex">
              <img
                src={
                  chainImageMappipng[
                    tab.name as keyof typeof chainImageMappipng
                  ]
                }
                className={`${classes.imgDimentions} mr-[6px] rounded-full`}
              />
              {tab.name}
            </div>
          </div>
        );
      }}
    />
  );
};
