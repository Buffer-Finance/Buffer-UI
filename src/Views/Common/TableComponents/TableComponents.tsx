import { ReactChild, ReactNode } from 'react';
import InfoIcon from 'src/SVG/Elements/InfoIcon';
import { CellDescLayout } from './style';
import { marketType } from '@Views/TradePage/type';
import { Display } from '../Tooltips/Display';
import { divide } from '@Utils/NumString/stringArithmatics';

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
  trade: TradeType;
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

export { CellHeadDesc, TableHeads };
