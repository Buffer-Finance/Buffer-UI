import { divide, gt, multiply } from '@Utils/NumString/stringArithmatics';
import { Display } from '@Views/Common/Tooltips/Display';
import { useChartMarketData } from '@Views/TradePage/Hooks/useChartMarketData';
import { ShareBetAtom, shareSettingsAtom } from '@Views/TradePage/atoms';
import styled from '@emotion/styled';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { RedGreenText } from './RedGreenText';
import { UpDownChipWOText } from './UpDownArrow';
import { BufferLogoComponent } from '@Views/Common/Navbar/BufferLogo';
import { getPayout } from './utils';
import { Token } from './Token';
import { TradeSize } from './TradeSize';
import { ReferralCode } from './ReferralCode';
import { ShareButtons } from './ShareButtons';
import { ShareTradeData } from './ShareTradeData';

export const ModalChild: React.FC<{ isMobile?: boolean }> = ({ isMobile }) => {
  const { trade, expiryPrice, market, poolInfo } = useAtomValue(ShareBetAtom);
  const { showTradeSize } = useAtomValue(shareSettingsAtom);
  const ref = useRef(null);
  const { getChartMarketData } = useChartMarketData();

  if (!trade || !expiryPrice || !poolInfo || !market)
    return <div className="text-f20 text-1">Loading...</div>;

  const chartData = getChartMarketData(market.token0, market.token1);
  const decimals = chartData.price_precision?.toString()?.length - 1;
  const unit = market.token1;
  const token0 = market.token0;
  const tradeSize = divide(trade.trade_size, decimals) as string;
  // console.log(`ShareModalChild-tradeSize: `, tradeSize);
  const { pnl } = getPayout(trade, Number(expiryPrice), decimals);

  if (!pnl || !expiryPrice) {
    return <div className="text-f20 text-1">Could not fetch data...</div>;
  }

  return (
    <>
      <div className="text-[#C3C2D4] w-[380px] h-[199px]  origin-left ">
        <BGImage ref={ref}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center">
              <BufferLogoComponent
                fontSize="text-[18px]"
                logoWidth={22}
                logoHeight={22}
                className={'mr-5'}
              />
              <div className="flex items-center gap-2 text-f16 bold mt-3">
                <div className="flex items-center  bg-[#02072C] px-4 py-1 rounded   font-">
                  <div className="mr-2 text-[#FFFFFF]">
                    {token0}-{unit}
                  </div>
                  <UpDownChipWOText isUp={trade.is_above} />
                  <div
                    className={`font-medium ml-2 ${
                      trade.is_above ? 'text-green' : 'text-red'
                    }`}
                  >
                    {trade.is_above ? 'Up' : 'Down'}
                  </div>
                </div>
                {showTradeSize && (
                  <Token
                    tokenName={poolInfo.token}
                    className="text-f18 font-medium"
                  />
                )}
              </div>

              <div className="flex items-center mt-3">
                <RedGreenText
                  conditionValue={pnl}
                  displayText={
                    <Display
                      data={multiply(divide(pnl, tradeSize) as string, '100')}
                      unit={'%'}
                      label={gt(pnl, '0') ? '+' : ''}
                      className="text-[28px] font-bold"
                    />
                  }
                />
                <div className="w-1 h-[30px] bg-grey mx-3"></div>

                {showTradeSize ? (
                  <TradeSize
                    tradeSize={trade.trade_size.toString()}
                    decimals={poolInfo.decimals}
                    unit={poolInfo.token}
                  />
                ) : (
                  <Token tokenName={poolInfo.token} />
                )}
              </div>
            </div>

            <ReferralCode />
          </div>

          <ShareTradeData
            decimals={decimals}
            expiryPrice={expiryPrice}
            trade={trade}
            unit={unit}
          />
        </BGImage>
      </div>

      <ShareButtons imageRef={ref} market={market} trade={trade} />
    </>
  );
};

const BGImage = styled.div`
  background-image: url('/shareModal/shareModalBg.png');
  background-repeat: round;
  padding: 25px 20px;
  padding-top: 22px;
  height: 100%;
`;
