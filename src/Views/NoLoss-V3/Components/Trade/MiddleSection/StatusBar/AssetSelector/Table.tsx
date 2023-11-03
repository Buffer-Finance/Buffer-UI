import Star from '@Public/ComponentSVGS/Star';
import { divide } from '@Utils/NumString/stringArithmatics';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import TableErrorMsg from '@Views/Common/BufferTable/ErrorMsg';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { TableHeader } from '@Views/Common/TableHead';
import { useUpdateActiveMarket } from '@Views/NoLoss-V3/Hooks/useUpdateActiveMarket';
import {
  filteredMarketsSelectAtom,
  noLossFavouriteMarketsAtom,
} from '@Views/NoLoss-V3/atoms';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { getMaximumValue } from '@Views/TradePage/utils';
import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import { useAtom, useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { OneDayChange } from '../MarketData/OneDayChange';
import { CloseTag } from './CloseTag';
import { CurrentPrice } from './CurrentPrice';

export const Table: React.FC<{
  group?: string;
  onMarketSelect?: () => void;
}> = ({ onMarketSelect, group }) => {
  const isMobile = typeof group == 'string';
  const filteredMarkets = useAtomValue(filteredMarketsSelectAtom);
  const [favouriteMarkets, setFavouriteMarkets] = useAtom(
    noLossFavouriteMarketsAtom
  );
  const { closeShutter } = useShutterHandlers();
  const { setActiveMarket } = useUpdateActiveMarket();

  const headers = useMemo(() => {
    return ['', 'Asset', 'Payout', '24h Change', 'Max Trade Size'];
  }, []);

  const HeadFormatter = (col: number) => {
    if (isMobile) return <></>;
    return <TableHeader col={col} headsArr={headers} />;
  };

  const BodyFormatter = (row: number, col: number) => {
    if (!filteredMarkets) return <></>;
    const market = filteredMarkets[row];
    const pairName = market.chartData.pair;
    const isOpen = !market.isPaused;
    const isForex = market.chartData.category.toLowerCase() === 'forex';
    const payout = getMaximumValue(
      divide(market.payoutForDown, 16) as string,
      divide(market.payoutForUp, 16) as string
    );
    const maxFee = divide(market.config.maxFee, 18) as string;
    const isFavourite = favouriteMarkets.includes(market.chartData.tv_id);

    const onStarClick = () => {
      if (isFavourite) {
        setFavouriteMarkets(
          favouriteMarkets.filter((item) => item !== market.chartData.tv_id)
        );
      } else {
        if (favouriteMarkets.length < 5) {
          setFavouriteMarkets([...favouriteMarkets, market.chartData.tv_id]);
        }
      }
    };
    switch (col) {
      case 0:
        return (
          <CellContent
            content={[
              <div className="text-1 flex items-center justify-center ">
                <IconButton onClick={onStarClick} className="!p-[0]">
                  <Star active={isFavourite} />
                </IconButton>
              </div>,
            ]}
          />
        );
      case 1:
        return (
          <CellContent
            content={[
              <div className="flex ">
                <div className="w-[20px] h-[20px]">
                  <PairTokenImage pair={pairName} />
                </div>
                <div className="text-1 ml-3">{pairName}</div>
              </div>,
            ]}
          />
        );
      case 2:
        if (!isOpen) return <>-</>;

        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">{payout}%</div>
              </div>,
            ]}
          />
        );
      case 3:
        if (!isOpen)
          return (
            <ColumnGap gap="4px " className="b1200:items-end">
              <CloseTag />
              {isForex && (
                <ShowTimingModalButton
                  onClick={
                    () => {}
                    //   setForexTimingsModal({
                    //     isOpen: true,
                    //     marketType: market.chartData.category,
                    //   })
                  }
                >
                  Schedule
                </ShowTimingModalButton>
              )}
            </ColumnGap>
          );
        return (
          <CellContent
            content={[
              <div className="flex flex-col items-start b1200:items-end">
                <CurrentPrice market={market} />
                <OneDayChange activeMarket={market} />
              </div>,
            ]}
          />
        );

      case 4:
        if (!isOpen) return <>-</>;

        return (
          <CellContent
            content={[
              <div className="flex items-center">
                <div className="text-1">{maxFee}</div>
              </div>,
            ]}
          />
        );

      default:
        return <div>Unhandled Column.</div>;
    }
  };

  return (
    <AssetSelectorDDBackground>
      <BufferTable
        widths={['1%', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto']}
        headerJSX={HeadFormatter}
        cols={isMobile ? 4 : headers.length}
        shouldShowMobile
        rows={filteredMarkets?.length || 0}
        bodyJSX={BodyFormatter}
        tableClass="b1200:!w-full assetSelectorTableWidth"
        error={
          <TableErrorMsg
            msg="No Assets Found."
            onClick={() => {}}
            shouldShowWalletMsg={false}
          />
        }
        loading={!filteredMarkets}
        isBodyTransparent
        isHeaderTransparent
        onRowClick={(rowNumber) => {
          if (!filteredMarkets) return;
          const selectedMarket = filteredMarkets[rowNumber];
          setActiveMarket(selectedMarket.chartData.pair);
          if (group) {
            // mobile
            closeShutter();
          } else {
            onMarketSelect?.();
          }
        }}
        overflow
        shouldHideHeader={isMobile}
      />
    </AssetSelectorDDBackground>
  );
};

const AssetSelectorDDBackground = styled.div`
  .assetSelectorTableWidth {
    width: min(100vw, 720px);
  }
`;

const ShowTimingModalButton = styled.button`
  color: #808191;
  background: transparent;
  border: none;
  outline: none;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-size: 10px;
  width: fit-content;
`;
