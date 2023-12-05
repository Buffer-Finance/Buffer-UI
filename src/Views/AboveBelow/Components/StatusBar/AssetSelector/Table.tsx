import Star from '@Public/ComponentSVGS/Star';
import { divide } from '@Utils/NumString/stringArithmatics';
import { navigateToarket } from '@Views/AboveBelow/Helpers/navigateToMarket';
import { useOneDayVolume } from '@Views/AboveBelow/Hooks/useOneDayVolume';
import {
  favouriteMarketsAtom,
  filteredMarketsAtom,
} from '@Views/AboveBelow/atoms';
import BufferTable from '@Views/Common/BufferTable';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { useShutterHandlers } from '@Views/Common/MobileShutter/MobileShutter';
import { TableHeader } from '@Views/Common/TableHead';
import { Display } from '@Views/Common/Tooltips/Display';
import { ColumnGap } from '@Views/TradePage/Components/Column';
import { TableErrorRow } from '@Views/TradePage/Views/AccordionTable/Common';
import { formatBalance } from '@Views/TradePage/Views/BuyTrade/TradeSizeSelector/WalletBalance';
import { PairTokenImage } from '@Views/TradePage/Views/PairTokenImage';
import { ForexTimingsModalAtom } from '@Views/TradePage/atoms';
import { AssetCategory } from '@Views/TradePage/type';
import styled from '@emotion/styled';
import { IconButton, Skeleton } from '@mui/material';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAddress } from 'viem';
import { OneDayChange } from '../MarketData/OneDayChange';
import { CloseTag } from './CloseTag';
import { CurrentPrice } from './CurrentPrice';

enum TableColumns {
  Star,
  Asset,
  OneDayChange,
  OneDayVolume,
  OpenUp,
  OpenDown,
}

export const Table: React.FC<{
  group?: string;
  onMarketSelect?: () => void;
}> = ({ onMarketSelect, group }) => {
  const isMobile = typeof group == 'string';
  const filteredMarkets = useAtomValue(filteredMarketsAtom);
  const [favouriteMarkets, setFavouriteMarkets] = useAtom(favouriteMarketsAtom);
  const navigate = useNavigate();
  const { closeShutter } = useShutterHandlers();
  const { oneDayVolume } = useOneDayVolume();

  const setActiveMarket = (token0: string, token1: string) => {
    navigateToarket(navigate, token0 + '-' + token1, '/above-below');
  };
  //   const isIncreationWindow = useIsMarketInCreationWindow();
  const isIncreationWindow = {
    crypto: true,
    forex: true,
    commodity: true,
  };
  const setForexTimingsModal = useSetAtom(ForexTimingsModalAtom);

  const headers = useMemo(() => {
    return ['', 'Asset', '24h Change', '24h Volume', 'Open Up', 'Open Down'];
  }, []);

  const HeadFormatter = (col: number) => {
    if (isMobile) return <></>;
    return <TableHeader col={col} headsArr={headers} />;
  };

  const BodyFormatter = (row: number, col: number) => {
    if (!filteredMarkets) return <></>;
    const market = filteredMarkets[row];
    const pairName = market.pair;
    const isOpen =
      !market.isPaused &&
      isIncreationWindow[
        market.category.toLowerCase() as 'crypto' | 'forex' | 'commodity'
      ];
    const isForex = market.category.toLowerCase() === 'forex';
    // const payout = getMaximumValue(
    //   divide(market.payoutForDown, 16) as string,
    //   divide(market.payoutForUp, 16) as string
    // );
    // const maxFee = divide(market.config.maxFee, 18) as string;

    const isFavourite = favouriteMarkets.includes(market.tv_id);
    const decimals = market.poolInfo.decimals;
    const onStarClick = () => {
      if (isFavourite) {
        setFavouriteMarkets(
          favouriteMarkets.filter((item) => item !== market.tv_id)
        );
      } else {
        if (favouriteMarkets.length < 5) {
          setFavouriteMarkets([...favouriteMarkets, market.tv_id]);
        }
      }
    };
    switch (col) {
      case TableColumns.Star:
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
      case TableColumns.Asset:
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
      //   case 2:
      //     if (isOpen === undefined)
      //       return <Skeleton className="w-[80px] !h-5 lc !transform-none" />;
      //     if (!isOpen) return <>-</>;

      //     return (
      //       <CellContent
      //         content={[
      //           <div className="flex items-center">
      //             <div className="text-1">{payout}%</div>
      //           </div>,
      //         ]}
      //       />
      //     );
      case TableColumns.OneDayChange:
        if (isOpen === undefined)
          return <Skeleton className="w-[80px] !h-5 lc !transform-none" />;

        if (!isOpen)
          return (
            <ColumnGap gap="4px " className="b1200:items-end">
              <CloseTag />
              {isForex && (
                <ShowTimingModalButton
                  onClick={() => {
                    const category = market.category as
                      | 'Forex'
                      | 'Crypto'
                      | 'Commodity';
                    setForexTimingsModal({
                      isOpen: true,
                      marketType:
                        AssetCategory[
                          category === 'Commodity' ? 'Commodities' : category
                        ],
                    });
                  }}
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

      case TableColumns.OneDayVolume:
        if (oneDayVolume === undefined)
          return <Skeleton className="w-[80px] !h-5 lc !transform-none" />;
        const volume = oneDayVolume?.[getAddress(market.address)];
        return (
          <Display
            data={formatBalance(divide(volume ?? '0', decimals) as string)}
            precision={2}
            unit={market.poolInfo.token}
            disable
            className="!justify-start"
          />
        );

      case TableColumns.OpenUp:
        return (
          <Display
            data={divide(market.openInterestUp, decimals)}
            precision={2}
            unit={market.poolInfo.token}
            disable
            className="!justify-start"
          />
        );
      case TableColumns.OpenDown:
        return (
          <Display
            data={divide(market.openInterestDown, decimals)}
            precision={2}
            unit={market.poolInfo.token}
            disable
            className="!justify-start"
          />
        );
      //   case 4:
      //     if (isOpen === undefined)
      //       return <Skeleton className="w-[80px] !h-5 lc !transform-none" />;

      //     if (!isOpen) return <>-</>;

      //     return (
      //       <CellContent
      //         content={[
      //           <div className="flex items-center">
      //             <div className="text-1">{toFixed(maxFee, 0)}</div>
      //           </div>,
      //         ]}
      //       />
      //     );

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
        error={<TableErrorRow msg="No Assets found." />}
        loading={!filteredMarkets}
        isBodyTransparent
        isHeaderTransparent
        onRowClick={(rowNumber) => {
          if (!filteredMarkets) return;
          const selectedMarket = filteredMarkets[rowNumber];
          setActiveMarket(selectedMarket.token0, selectedMarket.token1);
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
