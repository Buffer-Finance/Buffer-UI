import { ExpiryDate } from '@Views/AboveBelow/Components/BuyTrade/ExpiryDate';
import { useShutterHandlers } from '@Views/AboveBelow/Components/MobileView/Shutters';
import { tradeSizeAtom } from '@Views/AboveBelow/atoms';
import { shutterActiveTabAtom } from '@Views/Common/MobileShutter/VannilaOptionsConfig';
import { PoolDropdown } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/PoolDropdown';
import { useAtomValue, useSetAtom } from 'jotai';

const ViewOnlyInputs: React.FC<any> = ({}) => {
  const { openNormalOrdersShutter } = useShutterHandlers();
  const setActiveTab = useSetAtom(shutterActiveTabAtom);
  const amount = useAtomValue(tradeSizeAtom);

  return (
    <div className="flex items-center gap-x-3 font-[500]">
      <div className="flex w-full  bg-[#282B39] items-center rounded-[5px]">
        <button
          className={`w-full h-full text-left px-[10px] text-${
            amount ? '1' : '[#808191]'
          } text-f13`}
          onClick={() => {
            setActiveTab('Amount');
            openNormalOrdersShutter();
          }}
        >
          {amount ? amount : ' Enter'}
        </button>
        <PoolDropdown />
      </div>
      <ExpiryDate
        isMobile={true}
        openShutter={() => {
          setActiveTab('Duration');
          openNormalOrdersShutter();
        }}
      />
    </div>
  );
};

export { ViewOnlyInputs };
