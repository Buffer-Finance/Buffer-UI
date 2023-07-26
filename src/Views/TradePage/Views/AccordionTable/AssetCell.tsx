import LockIcon from '@SVG/Elements/LockIcon';
import TableAssetCell from '@Views/Common/BufferTable/TableAssetCell';
import { PairTokenImage } from '@Views/Common/PairTokenImage';
import NumberTooltip from '@Views/Common/Tooltips';
import { TradeType, marketType } from '@Views/TradePage/type';
import { UpDownChip } from './UpDownChip';

export const AssetCell: React.FC<{
  currentRow: TradeType;
  split?: boolean;
  configData: marketType | undefined;
  platform?: boolean;
}> = ({ currentRow, split, configData, platform }) => {
  const isUp = currentRow.is_above;
  if (!configData) return <></>;
  return (
    <TableAssetCell
      img={
        <div className="w-[20px] h-[20px] mr-[6px]">
          <PairTokenImage pair={configData} />
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
              {configData.token0 + '-' + configData.token1}{' '}
            </span>
            {platform ? <LockIcon /> : <UpDownChip isUp={isUp} />}
          </div>
        </NumberTooltip>
      }
      desc={<></>}
    />
  );
};
