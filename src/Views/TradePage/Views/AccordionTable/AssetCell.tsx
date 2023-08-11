import LockIcon from '@SVG/Elements/LockIcon';
import TableAssetCell from '@Views/Common/BufferTable/TableAssetCell';
import { PairTokenImage } from '@Views/Common/PairTokenImage';
import NumberTooltip from '@Views/Common/Tooltips';
import { TradeType } from '@Views/TradePage/type';
import { UpDownChip } from './UpDownChip';

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
        <div className="w-[20px] h-[20px] mr-[6px]">
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
            platform
              ? 'Trade directions are hidden.'
              : 'You choosed ' + (isUp ? 'Up' : 'Down')
          }
        >
          <div className={`flex ${split ? 'flex-col' : 'flex-row'} -ml-[6px]`}>
            <span className={`weight-400 text-f15 `}>
              {token0 + '-' + token1}{' '}
            </span>
            {isHidden || platform ? <LockIcon /> : <UpDownChip isUp={isUp} />}
          </div>
        </NumberTooltip>
      }
      desc={<></>}
    />
  );
};
