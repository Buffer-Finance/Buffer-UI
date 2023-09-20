import { priceAtom } from '@Hooks/usePrice';
import { getPriceFromKlines } from '@TV/useDataFeed';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';
import {
  LimitOrderPayoutPicker,
  StrikePricePicker,
} from '@Views/TradePage/Views/BuyTrade/CurrentPrice';
import { LimitOrderPayoutAtom, tradeTypeAtom } from '@Views/TradePage/atoms';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { PairTokenImage } from '../PairTokenImage';
import { BlueBtn } from '../V2-Button';
import { MobileShutterProps, useShutterHandlers } from './MobileShutter';

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

// const LOPayoutAtom = atomWithStorage<number>('LOPayout', 0);
export const useLOPayout = (): [string, SetAtom<any[], void>, string[]] => {
  const [minPayout, setMinPayout] = useAtom(LimitOrderPayoutAtom);
  const presets = ['60', '70', '80', '90'];
  return [minPayout, setMinPayout, presets];
};

const LOConfigs: React.FC<MobileShutterProps> = ({}) => {
  const { activeMarket } = useActiveMarket();
  const marketPrice = useAtomValue(priceAtom);
  const activeAssetPrice = getPriceFromKlines(marketPrice, {
    tv_id: activeMarket.tv_id,
  });
  const [minLOPayout, setMinLOPayout, presets] = useLOPayout();

  const setShutterType = useSetAtom(tradeTypeAtom);
  const { closeShutter } = useShutterHandlers();
  return (
    <div className="flex flex-col px-[5px] w-full mb-3">
      <div>
        <div></div>
        <span className="text-f12 text-[#808191] my-3 flex">
          Place a limit order on&nbsp;
          {activeMarket?.pair ? (
            <div className="w-[20px] text-1 h-[20px]">
              <PairTokenImage pair={activeMarket}></PairTokenImage>
            </div>
          ) : null}
          &nbsp;
          <span className="text-1 text-f14">
            {activeMarket.token0}-{activeMarket.token1}
          </span>
        </span>
        {/* <span className="text-f12 text-[#808191] my-3 mb-6">Payout Limit</span> */}
        <div className="flex gap-x-1  my-3 mb-4">
          {/* {presets.map((s) => {
            return (
              <button
                key={s}
                onClick={() => setMinLOPayout(s)}
                className={`text-f12 px-3 py-1  rounded-[3px] ${
                  s == minLOPayout
                    ? 'bg-blue text-1'
                    : 'bg-[#282B39] text-[#C3C2D4]'
                } `}
              >
                {s == 0 ? 'Any Payout' : 'Above ' + s + '%'}
              </button>
            );
          })} */}
          <LimitOrderPayoutPicker
            activePayout={minLOPayout}
            setActivePayout={setMinLOPayout}
          />
        </div>
      </div>
      <div>
        <span className="text-f12 text-[#808191] my-3">Trigger Price</span>
        <StrikePricePicker
          className="w-full text-left p-2 px-3 !mb-3"
          initialStrike={activeAssetPrice}
          precision={2}
        />
        <BlueBtn
          onClick={() => {
            setShutterType('Limit');
            closeShutter();
          }}
          className="!bg-blue mt-4"
        >
          Continue
        </BlueBtn>
      </div>
    </div>
  );
};

export { LOConfigs };
