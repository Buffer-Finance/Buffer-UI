import { Dialog } from '@mui/material';
import React, { useRef, useState } from 'react';

import { UpDownChipWOText } from '../Tables/TableComponents';
import {
  CloseOutlined,
  ContentCopy,
  FileDownloadOutlined,
} from '@mui/icons-material';
import { atom, useAtom, useAtomValue } from 'jotai';
import { Display } from '@Views/Common/Tooltips/Display';
import { getPendingData } from '../Tables/Desktop';
import { downloadGetLink, getNodeSnapshot, uploadImage } from '@Utils/DOMutils';
import { useCopyToClipboard } from 'react-use';
import {
  divide,
  gt,
  lt,
  multiply,
  subtract,
} from '@Utils/NumString/stringArithmatics';
import ButtonLoader from '@Views/Common/ButtonLoader/ButtonLoader';
import { formatDistanceExpanded } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { useToast } from '@Contexts/Toast';
import { BetState } from '@Hooks/useAheadTrades';
import { useUserCode } from '@Views/Referral/Hooks/useUserCode';
import { QRCodeSVG } from 'qrcode.react';
import { useHostName } from '../Hooks/useHostName';
import { BufferLogoComponent } from '@Views/Common/Navbar/BufferLogo';
import { affilateCode2ReferralLink } from '@Views/Referral';
import { V3AppConfig } from '@Views/V3App/useV3AppConfig';
import { useActiveChain } from '@Hooks/useActiveChain';
import { getImageUrl } from '../PGDrawer/PoolDropDown';
import styled from '@emotion/styled';

import {
  OngoingTradeSchema,
  marketType,
  poolInfoType,
} from '@Views/TradePage/type';
import { useChartMarketData } from '@Views/TradePage/Hooks/useChartMarketData';
import { TradeState } from '@Views/TradePage/Hooks/useOngoingTrades';

interface IShareModal {}

export const ShareModalStyles = styled.div`
  padding: 20px;
  background: #232334;
  border-radius: 12px;

  @media (max-width: 425px) {
    padding: 10px 0px;
  }
`;
const BGImage = styled.div`
  background-image: url('/shareModal/shareModalBg.png');
  background-repeat: round;
  padding: 25px 20px;
  padding-top: 22px;
  height: 100%;
  /*  */
  @media (max-width: 385px) {
    transform: translateX(-6px);
  }
`;

export const ShareStateAtom = atom<{ isOpen: boolean }>({ isOpen: false });
export const SetShareStateAtom = atom(null, (get, set, update: boolean) =>
  set(ShareStateAtom, { isOpen: update })
);
type ShareBetType = {
  trade: OngoingTradeSchema | null;
  expiryPrice: string | null;
  poolInfo: poolInfoType | null;
  market: marketType | null;
};
export const ShareBetAtom = atom<ShareBetType>({
  trade: null,
  expiryPrice: null,
  poolInfo: null,
  market: null,
});
export const SetShareBetAtom = atom(null, (get, set, update: ShareBetType) =>
  set(ShareBetAtom, update)
);

export const ShareModal: React.FC<IShareModal> = () => {
  const [{ isOpen }, setIsOpen] = useAtom(ShareStateAtom);
  const [, setBet] = useAtom(SetShareBetAtom);

  const closeModal = () => {
    setIsOpen({ isOpen: false });
    setBet({ expiryPrice: null, trade: null, poolInfo: null, market: null });
  };

  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <ModalChild closeModal={closeModal} />
    </Dialog>
  );
};
export const apiBaseUrl = 'https://share.buffer.finance';

const ModalChild: React.FC<{
  closeModal: () => void;
}> = ({ closeModal }) => {
  const { activeChain } = useActiveChain();
  const { trade, expiryPrice, market, poolInfo } = useAtomValue(ShareBetAtom);
  // console.log(trade, expiryPrice, poolInfo, market, 'shareModal');
  const ref = useRef();
  const [loading, setLoading] = useState(false);
  const [, copyToClipboard] = useCopyToClipboard();
  const toastify = useToast();
  const { affiliateCode } = useUserCode(activeChain);
  const isCodeSet = !!affiliateCode;
  const { hostname } = useHostName();
  const baseURL = `https://${hostname}/#/`;
  const sharableLink = isCodeSet
    ? affilateCode2ReferralLink(affiliateCode)
    : baseURL;
  const { getChartMarketData } = useChartMarketData();

  const uploadToServer = async () => {
    setLoading(true);
    const image = await getNodeSnapshot(ref.current);
    const imageInfo = await uploadImage(image);
    setLoading(false);
    toastify({
      type: 'success',
      msg: "Copied! Your trade's image will be ready in ~10s",
    });
    let url = `${apiBaseUrl}/api/position?id=${imageInfo.public_id}`;
    if (isCodeSet) url = `${url}&ref=${affiliateCode}`;
    copyToClipboard(url);
  };

  if (!trade || !expiryPrice || !poolInfo || !market)
    return <div className="text-f20 text-1">Loading...</div>;

  const downloadImage = async () => {
    const image = await getNodeSnapshot(ref.current);
    downloadGetLink(
      image,
      market.token0 +
        '-' +
        market.token1 +
        '|' +
        (trade.is_above ? 'Up' : 'Down')
    );
  };

  const chartData = getChartMarketData(market.token0, market.token1);
  const decimals = chartData.price_precision?.toString()?.length - 1;
  const unit = market.token1;
  const token0 = market.token0;

  const tradeExpiry = expiryPrice;
  const { pnl, payout } = getPayout(trade, tradeExpiry);
  if (!pnl || !payout || !tradeExpiry) {
    console.log(pnl, payout, tradeExpiry, 'shareModal');
    return <div className="text-f20 text-1">Could not fetch data...</div>;
  }

  const priceArr = [
    {
      key: 'Strike Price',
      value: (
        <Display
          data={divide(trade.strike, 8)}
          unit={unit}
          precision={decimals}
          className="inline whitespace-pre"
        />
      ),
    },
    {
      key: 'Expiry Price',
      value: (
        <Display
          data={divide(tradeExpiry, 8)}
          unit={unit}
          precision={decimals}
          className="inline whitespace-nowrap"
        />
      ),
    },
    {
      key: 'Duration',
      value: formatDistanceExpanded(Variables(+trade.period)),
    },
  ];

  return (
    <ShareModalStyles>
      <div className="flex justify-between items-center mb-4 shareModal:mb-3 shareModal:pl-5 shareModal:pr-3">
        <div className="text-f20 text-1 pb-2">Share Position</div>
        <button className="p-3 text-1 rounded-full bg-2" onClick={closeModal}>
          <CloseOutlined />
        </button>
      </div>
      <div className="text-3  w-[380px] h-[199px]">
        <BGImage ref={ref}>
          <div className="flex justify-between items-center">
            <div className="flex flex-col justify-center">
              <BufferLogoComponent
                fontSize="text-[18px]"
                logoWidth={22}
                logoHeight={22}
                className={'mr-5'}
              />
              <div className="flex items-center text-f16 bg-[#02072C] px-4 py-1 rounded font-bold mt-3">
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
              <div className="flex items-center">
                <RedGreenText
                  conditionValue={pnl}
                  displayText={
                    <Display
                      data={multiply(
                        divide(pnl, trade.trade_size.toString()) as string,
                        '100'
                      )}
                      unit={'%'}
                      label={gt(pnl, '0') ? '+' : ''}
                      className="text-[28px] font-bold"
                    />
                  }
                />
                <div className="w-1 h-[30px] bg-grey mx-3"></div>
                <div className="text-f16 text-3 flex items-center justify-center">
                  <img
                    src={getImageUrl(poolInfo.token)}
                    className="w-[22px] h-[22px] mr-2 "
                  />{' '}
                  ${poolInfo.token}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center items-center">
              {isCodeSet ? (
                <div className="text-[10px] font-bold mb-2 text-3">
                  Referral Code
                </div>
              ) : (
                <div className="text-[12px] font-bold mt-2 text-3">
                  Start Trading
                </div>
              )}
              <div className="p-2 bg-[#FFFFFF]">
                <QRCodeSVG value={sharableLink} size={60} />
              </div>
              {isCodeSet ? (
                <div className="text-[12px] font-bold mt-2 text-3">
                  {affiliateCode.slice(0, 7)}
                  {affiliateCode.length > 7 ? '...' : ''}
                </div>
              ) : (
                // <div className="text-[12px] font-bold mt-2 text-3">
                //   https://testnet.buffer.finance/
                // </div>
                <></>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center gap-x-5 mt-[13px]">
            {priceArr.map((p) => {
              return (
                <div className="flex flex-col whitespace-nowrap">
                  <div className="text-[11px] font-semibold">{p.key}</div>
                  <div className="text-f14 ">{p.value}</div>
                </div>
              );
            })}
          </div>
        </BGImage>
      </div>
      <div className="flex items-stretch mt-4 gap-3 sm:justify-center">
        <button
          className={`text-f16 text-3 bg-2 pb-[3px] pr-4 pl-[10px] rounded-sm h-[30px] whitespace-nowrap w-[80px] transition-all duration-300 hover:text-1`}
          onClick={uploadToServer}
        >
          {loading ? (
            <ButtonLoader className="" />
          ) : (
            <>
              <ContentCopy />
              <span className="ml-3 pb-1">Copy</span>
            </>
          )}
        </button>
        <button
          className={`text-f16 text-3 bg-2 pb-[3px] pr-4 pl-[10px] h-[30px] rounded-sm whitespace-nowrap transition-all duration-300 hover:text-1 sm:hidden`}
          onClick={downloadImage}
        >
          <FileDownloadOutlined />
          <span className="ml-3 pb-1">Download</span>
        </button>
      </div>
    </ShareModalStyles>
  );
};

const RedGreenText = ({
  displayText,
  conditionValue,
}: {
  displayText: JSX.Element;
  conditionValue: string;
}) => {
  return (
    <span
      className={`nowrap flex ${
        lt(conditionValue, '0') ? 'text-red' : 'text-green'
      }`}
    >
      {displayText}
    </span>
  );
};

const getPayout = (trade: OngoingTradeSchema, expiryPrice) => {
  if (trade.state === 'OPENED') {
    const [pnl, payout] = getPendingData(trade, expiryPrice);
    return { payout: payout as string, pnl: pnl as string };
  } else
    return {
      payout: trade?.payout || '0',
      pnl: trade?.payout
        ? trade.payout - trade.trade_size
        : subtract('0', trade.trade_size.toString()),
    };
};
