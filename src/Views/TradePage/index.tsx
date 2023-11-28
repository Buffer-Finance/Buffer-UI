import { useActiveChain } from '@Hooks/useActiveChain';
import { useGenericHooks } from '@Hooks/useGenericHook';
import { usePriceRetriable } from '@Hooks/usePrice';
import FrontArrow from '@SVG/frontArrow';
import ShutterProvider, {
  useShutterHandlers,
} from '@Views/Common/MobileShutter/MobileShutter';
import styled from '@emotion/styled';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useMedia } from 'react-use';
import { ModalBase } from 'src/Modals/BaseModal';
import { polygon, polygonMumbai } from 'viem/chains';
import { CloseConfirmationModal } from './CloseConfirmationModal';
import { MarketTimingsModal } from './Components/MarketTimingsModal';
import { TradePageMobile } from './Components/MobileView/TradePageMobile';
import { useBuyTradeData } from './Hooks/useBuyTradeData';
import { AccordionTable } from './Views/AccordionTable';
import { ShareModal } from './Views/AccordionTable/ShareModal';
import { BuyTrade } from './Views/BuyTrade';
import { EditModal } from './Views/EditModal';
import { MarketChart } from './Views/MarketChart';
import { MarketStatsBar } from './Views/MarketChart/MarketStatsBar';
import { PinnedMarkets } from './Views/Markets/PinnedMarkets';
import {
  chartControlsSettingsAtom,
  miscsSettingsAtom,
  rerenderPositionAtom,
  selectedOrderToEditAtom,
  tradePanelPositionSettingsAtom,
} from './atoms';
import { tradePanelPosition } from './type';

const TradePage: React.FC<any> = ({}) => {
  const panelPosision = useAtomValue(tradePanelPositionSettingsAtom);
  const { showFavoriteAsset } = useAtomValue(miscsSettingsAtom);
  usePriceRetriable();
  useBuyTradeData();
  const { closeShutter } = useShutterHandlers();
  const isNotMobile = useMedia('(min-width:1200px)');
  useEffect(() => {
    closeShutter();
    return closeShutter;
  }, []);
  const { activeChain } = useActiveChain();
  if ([polygon.id, polygonMumbai.id].includes(activeChain.id as 80001)) {
    return <MobileWarning />;
  }
  return (
    <>
      <EssentialModals />
      <div
        className={`flex h-full justify-between w-[100%] bg-[#1C1C28] ${
          panelPosision === tradePanelPosition.Left ? 'flex-row-reverse' : ''
        }`}
      >
        {isNotMobile ? (
          <>
            <RightPanelBackground>
              {showFavoriteAsset && <PinnedMarkets />}
              <MarketStatsBar />
              <MarketChart />
              <AccordionTable />
            </RightPanelBackground>
            <BuyTrade />
          </>
        ) : (
          <>
            <ShutterProvider />
            <TradePageMobile />
          </>
        )}
      </div>
    </>
  );
};

export { TradePage };

export const RightPanelBackground = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 8px;
  width: 100%;
  border-left: 1px solid #2a2a3a;
  border-right: 1px solid #2a2a3a;
`;

const MobileWarningBackground = styled.div`
  height: 100%;
  width: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: auto;
  gap: 12px;

  .heading {
    font-weight: 500;
    font-size: 18px;
    text-align: center;
    color: #ffffff;
  }

  .desc {
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    text-align: center;
    color: #7f87a7;
  }
`;

export const MobileWarning = () => {
  return (
    <MobileWarningBackground>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.14492 22.9293C3.25667 23.3654 3.37373 23.7961 3.48015 24.2322C3.84199 25.7052 4.41135 27.0878 5.16162 28.4013C6.26841 30.3369 7.69447 32.0014 9.44511 33.384C11.2383 34.7985 13.2391 35.8248 15.442 36.431C17.9376 37.117 20.4651 37.2287 23.0193 36.7714C25.7011 36.2928 28.1169 35.2239 30.2879 33.5807C32.5653 31.8578 34.2894 29.6935 35.5026 27.1144C36.1198 25.8009 36.5668 24.4289 36.7956 23.0038C36.9605 21.9934 36.9872 20.9618 37.067 19.9408C37.1042 19.4994 37.3916 19.1431 37.8119 19.0474C38.227 18.9517 38.6739 19.1272 38.8761 19.51C38.9613 19.6643 39.0092 19.8663 38.9985 20.0418C38.9506 20.9618 38.9294 21.8818 38.8017 22.7911C38.4505 25.3595 37.5618 27.7472 36.205 29.9487C35.162 31.6398 33.8796 33.1287 32.3684 34.4263C30.4688 36.0588 28.335 37.2712 25.9618 38.053C23.8068 38.7655 21.5932 39.0633 19.3158 38.9889C17.2405 38.9197 15.2398 38.5209 13.3029 37.7977C11.2383 37.0266 9.3653 35.9099 7.68383 34.4794C5.92254 32.9852 4.48584 31.225 3.35777 29.2149C2.33611 27.3856 1.63373 25.434 1.27721 23.3654C1.14419 22.6103 1.09098 21.8392 1.00584 21.0735C1.00052 21.0043 1.03244 20.9246 1.04841 20.8501C1.75079 21.5414 2.44786 22.238 3.14492 22.9293Z"
          fill="#7F87A7"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.05373 20.0046C1.03777 19.9142 1.00052 19.8238 1.00052 19.7334C0.989875 18.505 1.14419 17.2979 1.39428 16.0961C1.953 13.3947 3.06511 10.9326 4.70401 8.72038C6.28438 6.58265 8.23722 4.84375 10.5519 3.51432C12.5207 2.38165 14.6279 1.63185 16.8627 1.24897C17.927 1.06817 19.0018 0.96713 20.0873 1.00967C20.5237 1.02563 20.9706 1.38191 20.9972 1.98813C21.0185 2.44546 20.6141 2.89747 20.1299 2.93469C19.4488 2.98255 18.7677 2.99318 18.0866 3.06231C16.8574 3.18462 15.6655 3.46646 14.4948 3.86529C12.26 4.63104 10.2752 5.81158 8.52988 7.40158C7.1464 8.66188 6.00236 10.1136 5.08713 11.7515C4.01758 13.6712 3.35777 15.7132 3.07575 17.8881C3.07043 17.9413 3.04382 17.9892 3.02786 18.037C2.36272 18.6911 1.70822 19.3452 1.05373 20.0046Z"
          fill="#7F87A7"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.05373 20.0046C1.70822 19.3505 2.36804 18.6911 3.02254 18.037C3.00125 18.6167 2.9374 19.2016 2.96401 19.7812C3.00125 20.765 3.09703 21.7488 3.16621 22.7379C3.17153 22.8017 3.15557 22.8708 3.15024 22.9347C2.45318 22.2434 1.75611 21.5467 1.05905 20.8554C1.05373 20.5683 1.05373 20.2864 1.05373 20.0046Z"
          fill="#7F87A7"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M37.1362 15.6813C36.5189 15.7238 35.907 15.1601 35.8963 14.4848C35.8857 13.7669 36.4391 13.2085 37.1415 13.2085C37.8332 13.2032 38.3973 13.7616 38.3919 14.4476C38.3866 15.1548 37.7906 15.7132 37.1362 15.6813Z"
          fill="#7F87A7"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M34.6406 10.4114C34.0233 10.454 33.4114 9.89027 33.4007 9.21492C33.3901 8.49703 33.9435 7.93867 34.6459 7.93867C35.3376 7.93335 35.9017 8.49171 35.8963 9.1777C35.891 9.88496 35.3004 10.4486 34.6406 10.4114Z"
          fill="#7F87A7"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30.9158 6.61456C30.2985 6.6571 29.6866 6.09342 29.676 5.41807C29.6653 4.70017 30.2187 4.14181 30.9211 4.14181C31.6128 4.1365 32.1769 4.69486 32.1716 5.38084C32.1662 6.09342 31.5756 6.65178 30.9158 6.61456Z"
          fill="#7F87A7"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M25.6319 4.14181C25.0147 4.18435 24.4027 3.62068 24.3921 2.94532C24.3815 2.22743 24.9349 1.66907 25.6372 1.66907C26.329 1.66375 26.893 2.22211 26.8877 2.9081C26.8824 3.61536 26.2864 4.17904 25.6319 4.14181Z"
          fill="#7F87A7"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.3506 17.1631C17.3506 15.756 17.3305 14.3489 17.3506 12.9418C17.3707 11.7961 17.9138 11.1126 18.7586 11.0925C19.7039 11.0724 20.2671 11.7358 20.2872 12.9418C20.3073 15.3942 20.3073 17.8264 20.2872 20.2788C20.2872 20.8215 20.4481 21.123 20.9309 21.3643C22.017 21.8869 23.0831 22.4497 24.129 23.0528C25.0744 23.5754 25.356 24.3191 24.9537 25.1031C24.5514 25.887 23.7669 26.1081 22.8015 25.6257C21.2728 24.8619 19.7844 24.0377 18.2758 23.2538C17.5718 22.8719 17.3506 22.2688 17.3506 21.505C17.3707 20.0577 17.3506 18.6104 17.3506 17.1631Z"
          fill="#7F87A7"
        />
        <path
          d="M1.05373 20.0046C1.03777 19.9142 1.00052 19.8238 1.00052 19.7334C0.989875 18.505 1.14419 17.2979 1.39428 16.0961C1.953 13.3947 3.06511 10.9326 4.70401 8.72038C6.28438 6.58265 8.23722 4.84375 10.5519 3.51432C12.5207 2.38165 14.6279 1.63185 16.8627 1.24897C17.927 1.06817 19.0018 0.96713 20.0873 1.00967C20.5237 1.02563 20.9706 1.38191 20.9972 1.98813C21.0185 2.44546 20.6141 2.89747 20.1299 2.93469C19.4488 2.98255 18.7677 2.99318 18.0866 3.06231C16.8574 3.18462 15.6655 3.46646 14.4948 3.86529C12.26 4.63104 10.2752 5.81158 8.52988 7.40158C7.1464 8.66188 6.00236 10.1136 5.08713 11.7515C4.01758 13.6712 3.35777 15.7132 3.07575 17.8881C3.07043 17.9413 3.04382 17.9892 3.02786 18.037C2.36272 18.6911 1.70822 19.3452 1.05373 20.0046ZM1.05373 20.0046C1.70822 19.3505 2.36804 18.6911 3.02254 18.037C3.00125 18.6167 2.9374 19.2016 2.96401 19.7812C3.00125 20.765 3.09703 21.7488 3.16621 22.7379C3.17153 22.8017 3.15557 22.8708 3.15024 22.9347C2.45318 22.2434 1.75611 21.5467 1.05905 20.8554C1.05373 20.5683 1.05373 20.2864 1.05373 20.0046ZM3.14492 22.9293C3.25667 23.3654 3.37373 23.7961 3.48015 24.2322C3.84199 25.7052 4.41135 27.0878 5.16162 28.4013C6.26841 30.3369 7.69447 32.0014 9.44511 33.384C11.2383 34.7985 13.2391 35.8248 15.442 36.431C17.9376 37.117 20.4651 37.2287 23.0193 36.7714C25.7011 36.2928 28.1169 35.2239 30.2879 33.5807C32.5653 31.8578 34.2894 29.6935 35.5026 27.1144C36.1198 25.8009 36.5668 24.4289 36.7956 23.0038C36.9605 21.9934 36.9872 20.9618 37.067 19.9408C37.1042 19.4994 37.3916 19.1431 37.8119 19.0474C38.227 18.9517 38.6739 19.1272 38.8761 19.51C38.9613 19.6643 39.0092 19.8663 38.9985 20.0418C38.9506 20.9618 38.9294 21.8817 38.8017 22.7911C38.4505 25.3595 37.5618 27.7472 36.205 29.9487C35.162 31.6398 33.8796 33.1287 32.3684 34.4263C30.4688 36.0588 28.335 37.2712 25.9618 38.053C23.8068 38.7655 21.5932 39.0633 19.3158 38.9889C17.2405 38.9197 15.2398 38.5209 13.3029 37.7977C11.2383 37.0266 9.3653 35.9099 7.68383 34.4794C5.92254 32.9852 4.48584 31.225 3.35777 29.2149C2.33611 27.3856 1.63373 25.434 1.27721 23.3654C1.14419 22.6103 1.09098 21.8392 1.00584 21.0735C1.00052 21.0043 1.03244 20.9246 1.04841 20.8501C1.75079 21.5414 2.44786 22.238 3.14492 22.9293ZM37.1362 15.6813C36.5189 15.7238 35.907 15.1601 35.8963 14.4848C35.8857 13.7669 36.4391 13.2085 37.1415 13.2085C37.8332 13.2032 38.3973 13.7616 38.3919 14.4476C38.3866 15.1548 37.7906 15.7132 37.1362 15.6813ZM34.6406 10.4114C34.0233 10.454 33.4114 9.89027 33.4007 9.21492C33.3901 8.49703 33.9435 7.93867 34.6459 7.93867C35.3376 7.93335 35.9017 8.49171 35.8963 9.1777C35.891 9.88496 35.3004 10.4486 34.6406 10.4114ZM30.9158 6.61456C30.2985 6.6571 29.6866 6.09342 29.676 5.41807C29.6653 4.70017 30.2187 4.14181 30.9211 4.14181C31.6128 4.1365 32.1769 4.69486 32.1716 5.38084C32.1662 6.09342 31.5756 6.65178 30.9158 6.61456ZM25.6319 4.14181C25.0147 4.18435 24.4027 3.62068 24.3921 2.94532C24.3815 2.22743 24.9349 1.66907 25.6372 1.66907C26.329 1.66375 26.893 2.22211 26.8877 2.9081C26.8824 3.61536 26.2864 4.17904 25.6319 4.14181ZM17.3506 17.1631C17.3506 15.756 17.3305 14.3489 17.3506 12.9418C17.3707 11.7961 17.9138 11.1126 18.7586 11.0925C19.7039 11.0724 20.2671 11.7358 20.2872 12.9418C20.3073 15.3942 20.3073 17.8264 20.2872 20.2788C20.2872 20.8215 20.4481 21.123 20.9309 21.3643C22.017 21.8869 23.0831 22.4497 24.129 23.0528C25.0744 23.5754 25.356 24.3191 24.9537 25.1031C24.5514 25.887 23.7669 26.1081 22.8015 25.6257C21.2728 24.8619 19.7844 24.0377 18.2758 23.2538C17.5718 22.8719 17.3506 22.2688 17.3506 21.505C17.3707 20.0577 17.3506 18.6104 17.3506 17.1631Z"
          stroke="#7F87A7"
          strokeWidth="0.453174"
        />
      </svg>
      <div className="heading">V2.5 is not live on Polygon yet.</div>
      <div className="desc">
        <a
          href="
          https://classic.app.buffer.finance
        "
          target="_blank"
          className="underline text-buffer-blue underline-offset-2"
        >
          Click here to trade on older version
          <FrontArrow className="inline ml-[6px]" />
        </a>
      </div>
      {/* <BufferProgressBar progressPercent={40} /> */}
    </MobileWarningBackground>
  );
};

export const EssentialModals = () => {
  const setSelectedTrade = useSetAtom(selectedOrderToEditAtom);
  const setSettings = useSetAtom(chartControlsSettingsAtom);
  const selectedTrade = useAtomValue(selectedOrderToEditAtom);
  const setPositionRerender = useSetAtom(rerenderPositionAtom);
  const closeEditModal = () => {
    // on leaving edit modal
    if (selectedTrade?.default) {
      setPositionRerender((d) => d + 1);
    }
    setSelectedTrade(null);
  };
  useGenericHooks();

  return (
    <>
      <CloseConfirmationModal />

      <MarketTimingsModal />
      <ShareModal />
      <ModalBase
        className="!p-[0px]"
        open={selectedTrade ? true : false}
        onClose={closeEditModal}
      >
        <EditModal
          defaults={selectedTrade?.default}
          trade={selectedTrade?.trade!}
          onSave={(val: boolean) => {
            setTimeout(() => {
              setSettings((s) => {
                return {
                  ...s,
                  loDragging: val,
                };
              });
            }, 3000);
            setSelectedTrade(null);
          }}
          market={selectedTrade?.market!}
        />
      </ModalBase>
    </>
  );
};
