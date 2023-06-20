import { ReactChild, ReactNode } from 'react';
import InfoIcon from 'src/SVG/Elements/InfoIcon';
import VersionChip from '@Views/Common/VersionChip';
import { AssetCellLayout, CellDescLayout } from './style';
import { OngoingTradeSchema } from '@Views/TradePage/Hooks/useOngoingTrades';
import { marketType } from '@Views/TradePage/type';
import { Display } from '../Tooltips/Display';
import { divide } from '@Utils/NumString/stringArithmatics';
import TableAssetCell from '../BufferTable/TableAssetCell';
import { UpDownChip } from '@Views/BinaryOptions/Tables/TableComponents';
import { PairTokenImage } from '../PairTokenImage';
import LockIcon from '@SVG/Elements/LockIcon';
import NumberTooltip from '../Tooltips';

interface ITableCellInfo {
  label: string | ReactChild;
  desc?: ReactNode;
  className?: string;
  headStyle?: string;
}

interface ILockeValue {
  labels: ITableCellInfo[];
}

const CellHeadDesc: React.FC<ILockeValue> = ({ labels }) => {
  if (!labels.length) return;
  return (
    <CellDescLayout>
      <div className="flexc-center mobile-align">
        <span
          className={`head-text text-left flex-center ${labels[0].headStyle}`}
        >
          {labels[0].label}
          {labels[0].desc && (
            <InfoIcon className="tml" sm tooltip={labels[0].desc} />
          )}
        </span>
        {labels.slice(1).map((cellInfo: ITableCellInfo) => (
          <span className={`desc-text text-left flex ${cellInfo?.className}`}>
            {cellInfo.label}
            {cellInfo.desc && (
              <InfoIcon sm className="tml txxmt" tooltip={cellInfo?.desc} />
            )}
          </span>
        ))}
      </div>
    </CellDescLayout>
  );
};

export const StrikePriceComponent = ({
  trade,
  configData,
  isMobile = false,
}: {
  trade: OngoingTradeSchema;
  configData: marketType | undefined;
  isMobile?: boolean;
}) => {
  if (!configData) return <></>;
  const decimals = 2;
  return (
    <>
      <Display
        data={divide(trade.strike, 8)}
        unit={configData.token1}
        precision={decimals}
        className={`${
          !isMobile
            ? 'justify-self-start content-start'
            : 'justify-self-end content-end'
        }  w-max`}
      />
      {/* {!isMobile && trade.state === BetState.queued ? (
        <div className="flex gap-2 align-center">
          <SlippageTooltip option={trade} className="mt-[2px] mr-[3px]" />
          Slippage -
          <Display
            data={divide(trade?.slippage, 2)}
            unit="%"
            className="mr-[3px]"
            precision={2}
          />
        </div>
      ) : null} */}
    </>
  );
};

const AssetCell: React.FC<{
  currentRow: OngoingTradeSchema;
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
interface IAssetCell {
  version?: number | string;
  tooltip?: string;
  head: string;
  img?: string;
  desc?: any;
  style?: string;
  remark?: ReactNode;
  assetStyle?: string;
}

interface ITableHeads {
  children: string | JSX.Element;
  tooltip?: string;
  style?: string;
}

const TableHeads: React.FC<ITableHeads> = ({ children, style, tooltip }) => {
  return (
    <div className={`f14 capitialize ${style}`}>
      {children}
      {tooltip && (
        <img src="/PredictionGames/info.svg" alt="" className="info-tooltip" />
      )}
    </div>
  );
};

export { CellHeadDesc, AssetCell, TableHeads };
