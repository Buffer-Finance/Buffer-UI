import DropdownArrow from '@SVG/Elements/DropDownArrow';
import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';

export type Products = 'Up/Down' | 'Above/Below';
const tabList: Products[] = ['Up/Down', 'Above/Below'];

export const ProductDropDown: React.FC<{
  classes?: {
    imgDimentions: string;
    fontSize: string;
    itemFontSize: string;
    verticalPadding: string;
  };
  activeProduct: Products;
  setActiveProduct: (product: Products) => void;
}> = ({
  activeProduct,
  setActiveProduct,
  classes = {
    imgDimentions: 'h-[22px] w-[22px] ',
    fontSize: 'text-f15',
    itemFontSize: 'text-f14',
    verticalPadding: 'py-[6px]',
  },
}) => {
  return (
    <BufferDropdown
      rootClass="w-fit m-auto"
      className="py-4 px-4 bg-2 !w-max"
      dropdownBox={(a, open, disabled) => (
        <div
          className={`flex items-center justify-between ${classes.fontSize} font-medium bg-[#2c2c41] pl-3 pr-[0] ${classes.verticalPadding} rounded-sm text-1`}
        >
          <div className="flex items-center">{activeProduct}</div>
          <DropdownArrow open={open} />
        </div>
      )}
      items={tabList}
      item={(tab, handleClose, onChange, isActive, index) => {
        const isActiveTab = activeProduct === tab;
        return (
          <div
            key={tab.name}
            className={`${classes.itemFontSize} whitespace-nowrap ${
              index === tabList.length - 1 ? '' : 'pb-[6px]'
            } ${index === 0 ? '' : 'pt-[6px]'} ${
              isActiveTab ? 'text-1' : 'text-2'
            }`}
            onClick={() => setActiveProduct(tab)}
          >
            <div className="flex">{tab}</div>
          </div>
        );
      }}
    />
  );
};
