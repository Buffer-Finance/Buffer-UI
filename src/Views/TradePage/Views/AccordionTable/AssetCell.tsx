import LockIcon from '@SVG/Elements/LockIcon';
import TableAssetCell from '@Views/Common/BufferTable/TableAssetCell';
import { PairTokenImage } from '@Views/Common/PairTokenImage';
import NumberTooltip from '@Views/Common/Tooltips';
import { TradeType } from '@Views/TradePage/type';
import { UpDownChip } from './UpDownChip';
import { formatAsset } from '@Utils/TableUtils';

export const AssetCell: React.FC<{
  currentRow: TradeType;
  split?: boolean;
  platform?: boolean;
}> = ({ currentRow, split, platform }) => {
  const isHidden = currentRow.is_above === undefined;
  const isUp = currentRow.is_above;
  const token0 = currentRow.market.token0;
  const token1 = currentRow.market.token1;
  return (
    <TableAssetCell
      img={
        <div className="w-[20px] h-[20px] mr-[6px] sm:w-[15px] sm:h-[15px] sm:mt-1 sm:mr-2">
          <PairTokenImage
            pair={{
              token0,
              token1,
            }}
          />
        </div>
      }
      head={
        <NumberTooltip
          content={
            platform || isHidden
              ? 'Trade directions are hidden.'
              : 'You chose ' + (isUp ? 'Up' : 'Down')
          }
        >
          <div className={`flex  -ml-[6px]`}>
            <span className={`weight-400 text-f15 sm:text-f12 `}>
              {formatAsset(token0, token1)}{' '}
            </span>
            {isHidden || platform ? (
              <LockIcon />
            ) : (
              <UpDownChip isUp={isUp} shouldShowText={false} className="ml-3" />
            )}
          </div>
        </NumberTooltip>
      }
      desc={<></>}
    />
  );
};
