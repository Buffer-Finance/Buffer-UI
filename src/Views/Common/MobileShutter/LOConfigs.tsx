import { StrikePricePicker } from '@Views/TradePage/Views/BuyTrade/CurrentPrice';
import { MobileShutterProps, useShutterHandlers } from './MobileShutter';
import { useToast } from '@Contexts/Toast';
import { BlueBtn } from '../V2-Button';
import { atom, useAtom, useSetAtom } from 'jotai';
import { tradeTypeAtom } from '@Views/TradePage/atoms';
import { atomWithStorage } from 'jotai/utils';
import { PairTokenImage } from '../PairTokenImage';
import { useActiveMarket } from '@Views/TradePage/Hooks/useActiveMarket';

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

const LOPayoutAtom = atomWithStorage<number>('LOPayout', 0);
export const useLOPayout = (): [number, SetAtom<any[], void>, number[]] => {
  const [minPayout, setMinPayout] = useAtom(LOPayoutAtom);
  const presets = [0, 70, 80, 90];
  return [minPayout, setMinPayout, presets];
};

const LOConfigs: React.FC<MobileShutterProps> = ({ activeAssetPrice }) => {
  const toastify = useToast();
  const { activeMarket } = useActiveMarket();

  const setShutterType = useSetAtom(tradeTypeAtom);
  const { closeShutter } = useShutterHandlers();
  const [minLOPayout, setMinLOPayout, LOPayoutPresets] = useLOPayout();
  return (
    <div className="flex flex-col px-[5px] w-full mb-3">
      <div>
        <div></div>
        <span className="text-f12 text-[#808191] my-3 flex">
          Place an order on&nbsp;
          {activeMarket?.pair ? (
            <div className="w-[20px] text-1">
              <PairTokenImage pair={activeMarket}></PairTokenImage>
            </div>
          ) : null}
          &nbsp;
          <span className="text-1 text-f14">
            {activeMarket.token0}-{activeMarket.token1}
          </span>
        </span>
        <span className="text-f12 text-[#808191] my-3 mb-6">Payout Limit</span>
        <div className="flex gap-x-4  my-3">
          {LOPayoutPresets.map((s) => {
            return (
              <button
                key={s}
                onClick={() => setMinLOPayout(s)}
                className={`text-f12 px-3 py-1 rounded-[3px] ${
                  s == minLOPayout
                    ? 'bg-blue text-1'
                    : 'bg-[#282B39] text-[#C3C2D4]'
                } `}
              >
                {s == 0 ? 'Any Payout' : 'Above ' + s + '%'}
              </button>
            );
          })}
        </div>
      </div>
      <form
        onSubmit={() => {
          setShutterType('Limit');
          closeShutter();
        }}
      >
        <div>
          <span className="text-f12 text-[#808191] my-3">Trigger Price</span>
          <StrikePricePicker
            className="w-full text-left p-2 px-3"
            initialStrike={activeAssetPrice}
            precision={2}
          />
          <BlueBtn
            type="submit"
            onClick={console.log}
            className="!bg-blue mt-4"
          >
            Continue
          </BlueBtn>
        </div>
      </form>
    </div>
  );
};

export { LOConfigs };
