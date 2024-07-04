import { useTimer } from '@Hooks/Utilities/useStopWatch';
import { useTimer2 } from '@Hooks/Utilities/usestopwatch2';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import { useUserAccount } from '@Hooks/useUserAccount';
import { toFixed } from '@Utils/NumString';
import { useNavigateToTrade } from '@Views/Profile/Components/UserDataComponent/UserData';
import { useNavigate } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { UserCard } from './JackPotWInnerCard';
import { DataWrapper } from '@Views/Profile/Components/UserDataComponent/UserDataV2';
import { Col } from '@Views/Common/ConfirmationModal';
import JackpotWinnerCard from './JackPotWInnerCard';
import HTPJ1 from 'public/JackpotEligible.png';
import HTPJ2 from 'public/JackpotWon.png';
import { useState } from 'react';
import { useMedia } from 'react-use';
import { useJackpotInfo } from './useJackpotInfo';
import { divide } from '@Utils/NumString/stringArithmatics';
import useSWR from 'swr';
import axios from 'axios';
import { baseUrl } from '@Views/TradePage/config';
import { isTestnet } from 'config';
import { Skeleton } from '@mui/material';
import { ModalBase } from 'src/Modals/BaseModal';
import React from 'react';
import { atom, useAtom, useAtomValue } from 'jotai';
import { addMarketInTrades } from '@Views/TradePage/utils';
import { addMarketInTrades as addMarketInTradesAB } from '@Views/ABTradePage/utils';
import { useAllV2_5MarketsConfig } from '@Views/TradePage/Hooks/useAllV2_5MarketsConfig';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useAboveBelowMarketsSetter } from '@Views/AboveBelow/Hooks/useAboveBelowMarketsSetter';
import { aboveBelowMarketsAtom } from '@Views/AboveBelow/atoms';

const bet = {
  id: 230,
  signature_timestamp: 1709823201,
  queued_timestamp: 1709823203,
  queue_id: 229,
  strike: 6707127496057,
  period: 60,
  target_contract: '0x763f9772D040B62Dc5dA4C02051cb9e835EcBdF7',
  jackpot_amount: '1000000000000000000',
  user_partial_signature:
    '0x0fd2b0bed2e9ed443d7ff741e7b961e10fad79e3f6ca33af28489934438c7ef7569d7a53b0b4442c3bd5736ed91501464ed8a04cfb243f140098c2f1327000211c',
  user_full_signature:
    '0xa2e7575af6d8db1270b0915b5c2d4b13684e0b27b05545baa5c73e291714d4c60b71028b630a7166358adf51e2f779907f875a5b31f9a916c5683a0bf90361a61b',
  user_address: '0x08f518870ec33bc96cc251692b79a745c1af78b5',
  trade_size: '2000000000000000000',
  allow_partial_fill: true,
  referral_code: '',
  trader_nft_id: 0,
  slippage: 5,
  settlement_fee: 1250,
  settlement_fee_sign_expiration: 1709823229,
  settlement_fee_signature:
    '0xf533b246abce1eac81e20bf0b48edcd5915ed0068870e47d26d32c0a84026fda61bb9c0979a7fc510ea19ba873f7c80ed0482c331eb788b1b6087681baa2b3591c',
  expiration_time: 1709823263,
  is_above: true,
  state: 'CLOSED',
  option_id: 166,
  is_limit_order: false,
  limit_order_expiration: 1709823203,
  environment: '421614',
  expiry_price: 6717172755223,
  payout: '3.5e+18',
  close_time: 1709823263,
  limit_order_duration: 0,
  locked_amount: '3500000000000000003',
  is_cancelled: false,
  cancellation_reason: null,
  cancellation_timestamp: null,
  early_close_signature: null,
  user_close_timestamp: null,
  open_timestamp: 1709823203,
  token: 'ARB',
  router: '0x0511b76254e86A4E6c94a86725CdfF0E7A8B4326',
  strike_timestamp: 1709823199,
};
const d = {
  id: 470,
  signature_timestamp: 1710846395,
  queued_timestamp: 1710846403,
  queue_id: 469,
  strike: 6312787347070,
  period: 900,
  target_contract: '0x763f9772D040B62Dc5dA4C02051cb9e835EcBdF7',
  user_partial_signature:
    '0x557e5c6f0c7573d4011516c7f0ed6853901bf4465f01ed7e24910a52b03307776c08ab1ecfad0d0379b1f32289ba7596f3bfa4b542a891abed12c6460b773ec91c',
  user_full_signature:
    '0x4a9b03fbc6c1ff1b73748c72adf9896b72abf3bf34c383e5ca3c6b5d3f0641994be0a56a24d69a860c5b7db2eb51b97a69fa40356013eeb5b2a1db2bfdb0b9641b',
  user_address: '0xFbEA9559AE33214a080c03c68EcF1D3AF0f58A7D',
  trade_size: '78000000000000000000',
  allow_partial_fill: true,
  referral_code: '',
  trader_nft_id: 0,
  slippage: 5,
  settlement_fee: 1250,
  settlement_fee_sign_expiration: 1710846516,
  settlement_fee_signature:
    '0x1c2547d1e117e2721d90a37a2f70a892f070920531d71818740cba98d85f6bf421d911bc2a1de957c448acae8f0e5cdb7675856a6628c60e5c23fdceb6c4c3361c',
  expiration_time: 1710847303,
  is_above: false,
  state: 'CLOSED',
  option_id: 346,
  is_limit_order: false,
  limit_order_expiration: 1710846403,
  environment: '421614',
  expiry_price: 6261244101855,
  payout: '1.365e+20',
  close_time: 1710847303,
  limit_order_duration: 0,
  locked_amount: '136500000000000000136',
  is_cancelled: false,
  cancellation_reason: null,
  cancellation_timestamp: null,
  early_close_signature: null,
  user_close_timestamp: null,
  open_timestamp: 1710846403,
  token: 'ARB',
  router: '0x0511b76254e86A4E6c94a86725CdfF0E7A8B4326',
  strike_timestamp: 1710846399,
  jackpot_amount:
    '31500000000000000000                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                ',
  jackpot_txn_hash:
    '0x8493bcb3347f1bfb0ae45fe42fc110dc38f47af5b24c6b51b1a0c2bfc10dd651                                                                                                                                                                                                                                                                                                                                                                                                                                                  ',
};
const isOpenAtom = atom(false);
const Jackpot: React.FC<any> = ({}) => {
  const { highestTierNFT } = useHighestTierNFT({ userOnly: false });
  const { address } = useAccount();
  const data = {
    data: [bet],
  };
  const pastJackpots = usePlatforJackpots();
  const isMobile = useMedia('(max-width:600px)');
  const [page, setPage] = React.useState(1);
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);
  const jackpotInfo = useJackpotInfo();
  const navigate = useNavigate();
  const jackpotAmount = '20';
  const minSize = jackpotInfo?.minSize ? jackpotInfo.minSize.toString() : '0';

  let recentPlatformJackpot = pastJackpots[0]?.[0]?.open_timestamp || null;
  const content = {
    name: 'Dice',
    pages: [
      {
        image: HTPJ1,
        body: (
          <span>
            Level up your chances to win big! Place a trade that's greater than{' '}
            <b>
              {minSize}&nbsp;{JackpotToken}{' '}
            </b>
            to be eligible for a jackpot— aim high!
          </span>
        ),
      },
      {
        image: HTPJ2,
        body: (
          <span>
            You have a chance to win up to{' '}
            <b>
              {jackpotAmount}&nbsp;
              {JackpotToken}
            </b>{' '}
            of the glorious Jackpot pool. Get ready to place your Up/Down bets
            and claim your Jackpot!.
          </span>
        ),
      },
    ],
    bankrollEdge: 1,
    contractAddress: 'dd',
  };
  const pageContent = content.pages[page - 1];

  return (
    <>
      {' '}
      <ModalBase
        className={
          '  !overflow-y-auto  !bg-[#232334] sm:!px-[17px] !px-[26px]  !py-5 sm:w-full sm:m-[0px] !rounded-md sm:!rounded-sm   '
        }
        rootClass="!w-[340px]"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="relative bg-[#232334] flex flex-col    ">
          {/* Header with close button */}
          <div className="flex flex-row items-center justify-between mt-3 ">
            <div className="text-white text-[22px] font-medium leading-normal">
              How Jackpot Works
            </div>
            <img
              src={'/cross.svg'}
              alt="close"
              onClick={() => {
                setIsOpen(false);
              }}
              className="w-[23.94px] h-[24.48px] cursor-pointer"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col mt-[20px] gap-[20px]  ">
            <img
              src={pageContent.image}
              alt="play"
              className="img-mob-width nsm:w-full  aspect-[1.6] mx-auto "
            />
            <div className="flex flex-col items-start justify-start mx-2 text-[16px] font-normal leading-normal text-slate-400 sm:text-sm">
              {pageContent.body}
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col justify-center  px-[10px] mt-[27.75px]">
            <div className="flex flex-col">
              <div className="flex flex-row items-center justify-between">
                {/* Step 1/4 */}
                <div>
                  <span className="text-[18px] font-normal leading-normal text-[#fff] ">
                    Step{' '}
                  </span>
                  <span className="text-[18px] font-semibold leading-normal text-[#fff] ">
                    {page}
                  </span>
                  <span className="text-[18px] font-normal leading-normal text-white ">
                    /
                  </span>
                  <span className="text-[18px] text-[#C3C2D4] font-semibold leading-normal text-slate-400 ">
                    {content.pages.length}
                  </span>
                </div>

                <div>
                  <button
                    className=" text-white  w-[24px]   h-[24px] text-[18px] sm:w-[22.90px] sm:h-[22.90px] bdddbg rounded-[3.10px] shadow border bccc justify-center items-center inline-flex mr-2"
                    onClick={() => {
                      if (page > 1) {
                        setPage((prev) => prev - 1);
                      }
                    }}
                  >
                    {'<'}
                  </button>
                  <button
                    className=" text-white  w-[24px]   h-[24px] text-[18px] sm:w-[22.90px] sm:h-[22.90px] bdddbg rounded-[3.10px] shadow border bccc justify-center items-center inline-flex"
                    onClick={() => {
                      if (page < content.pages.length) {
                        setPage((prev) => prev + 1);
                      }
                    }}
                  >
                    {'>'}
                  </button>
                </div>
              </div>
              <BlueBtn
                onClick={() => {
                  navigate('/slots');
                }}
                className="my-[15px] sm:my-[20px] bg-gradient-to-b from-sky-300 to-blue-400 rounded flex justify-center items-center cursor-pointer "
              >
                <div className="my-2 text-sm font-semibold text-center text-zinc-950 text-[16px]">
                  Trade Now
                </div>
              </BlueBtn>
            </div>
          </div>
        </div>
      </ModalBase>
      <div className="flex gap-4 m-auto mt-6 sm:mx-4">
        <div className=" flex flex-col gap-5 sm:w-full">
          <div className="flex items-center gap-5  sm:bg-[#1c1c28] sm:py-2  sm:justify-center">
            {/* <div className="flex items-center gap-5 sm:sticky sm:top-[35px] sm:bg-[#1c1c28] sm:py-2 sm:z-10 sm:justify-center"> */}
            <>
              <div className="relative w-[72px] h-[72px] sm:w-[38px] sm:h-[38px] sm:-mt-3 ">
                <CircleAroundPicture />
                {highestTierNFT !== null ? (
                  <img
                    src={
                      'https://gateway.pinata.cloud/ipfs/' +
                      highestTierNFT?.nftImage.split('://')[1]
                    }
                    alt=""
                    className={
                      'absolute z-0 m-2  w-[68px]  h-[68px]   rounded-full left-[50%] top-[50%] -translate-y-[50%]  -translate-x-[50%] sm:w-full sm:h-full'
                    }
                  />
                ) : (
                  <img
                    src="/NFT-ph.png"
                    className={
                      'absolute z-0 m-2  w-[68px]  h-[68px]   rounded-full left-[50%] top-[50%] -translate-y-[50%]  -translate-x-[50%] sm:w-full sm:h-full'
                    }
                  />
                )}
              </div>
              <div className="text-[25px] text-[#C3C2D4] font-[500] sm:hidden ">
                {address
                  ? address.substring(0, 4) +
                    '....' +
                    address.substring(address.length - 4)
                  : 'Connect your wallet'}
              </div>
            </>
            {isMobile ? <JackpotSummary /> : null}
          </div>
          <JackpotValueSeciont />
          <RecentJackPotTimer recentTime={recentPlatformJackpot} />
          <div className="nsm:hidden">
            <RecentJackpots />
          </div>
        </div>
        <div className="flex flex-col gap-5 sm:hidden">
          <JackpotSummary sm />
          <RecentJackpots sm />
        </div>
      </div>
    </>
  );
};
const emptyAr = [];
export default Jackpot;
export { Jackpot };
const defaultResp = [[], []];
const usePlatforJackpots = () => {
  const user = useAccount();
  const markets = useAllV2_5MarketsConfig();
  useAboveBelowMarketsSetter();
  const marketsAB = useAtomValue(aboveBelowMarketsAtom);

  const { data } = useSWR(`jackpot-users-${user.address}`, {
    fetcher: async () => {
      const allHistory = axios.get(
        `${baseUrl}jackpot/all_history/?environment=${
          isTestnet ? 421614 : 42161
        }&order_by=-close_time&limit=100&page=0`
      );
      const userHistory = user.address
        ? axios.get(
            `${baseUrl}jackpot/user/history/?environment=${
              isTestnet ? 421614 : 42161
            }&order_by=-close_time&limit=100&page=0&user_address=${
              user.address
            }`
          )
        : null;
      const res = await Promise.all([allHistory, userHistory]);
      const response = res.map((d, idx) => {
        return d?.data?.page_data
          ? addMarketInTradesAB(
              addMarketInTrades(d?.data?.page_data, markets),
              marketsAB
            )
          : emptyAr;
      });
      return response;
    },
    refreshInterval: 1000,
  });
  return data || defaultResp;
};
function RecentJackpots(props) {
  const [userTab, setUserTab] = useState(false);
  const [all, users] = usePlatforJackpots();
  const datas = userTab ? users : all;
  const headClass = '#B1B6C6';
  return (
    <div
      className={[
        'bg-[#141823] px-[25px] py-[18px] rounded-[12px]',
        props.sm ? 'sm:hidden' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 font-[600]  min-w-[330px] text-[#B1B6C6] mb-3">
        <button
          onClick={() => {
            setUserTab(false);
          }}
          className={' text-f12 ' + (userTab ? '' : 'text-1')}
        >
          All Winnings
        </button>
        <button
          onClick={() => {
            setUserTab(true);
          }}
          className={' text-f12 ' + (userTab ? 'text-1' : '')}
        >
          My Winnings
        </button>
      </div>
      <div className="flex flex-col gap-3 h-[59vh]  overflow-auto pr-2 scrollbar-heavy">
        {datas.length ? (
          datas.map((s) => <UserCard key={s.id} bet={s} isUser={userTab} />)
        ) : (
          <div className="text-f14 bg-[#232334] w-full p-3 rounded-sm">
            No wins yet!
          </div>
        )}
      </div>
    </div>
  );
}

const JackpotToken = 'ARB';
function JackpotValueSeciont(props) {
  const jackpotInfo = useJackpotInfo();
  console.log(`index-jackpotInfo: `, jackpotInfo);

  const poolBalance = jackpotInfo?.poolBalance;
  const amount =
    poolBalance != null && poolBalance != undefined
      ? poolBalance.toString()
      : null;
  const [isOpen, setIsOpen] = useAtom(isOpenAtom);

  const minSize = jackpotInfo?.minSize ? jackpotInfo.minSize.toString() : '0';
  console.log(`index-minSize: `, minSize);
  const isMobile = useMedia('(max-width:600px)');

  if (isMobile) {
    return (
      <>
        <div
          className={[
            'relative flex  sm:sm:aspect-[1.7]   flex-col items-center overflow-hidden rounded-[12px] px-[15px] py-[12px] w-full   nb-image-sm min-w-fit',
            props.className,
          ].join(' ')}
        >
          <button
            className="relative mt-4 flex  gap-1 self-end items-center"
            onClick={() => setIsOpen(true)}
          >
            {/* <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c918dc20adb64f78c725558364a049f97b9c2d04ba6e3e9d5e946ec1ee5c8b34?"
            className=" -mt-[1px] items-center w-[12px] justify-center object-contain object-center  max-w-full overflow-hidden aspect-square shrink-0"
          /> */}
            {/* <div className="self-start text-[12px] font-bold leading-4 text-right text-gray-400 grow whitespace-nowrap hover:underline">
            How it works
          </div> */}
          </button>
          <div className="relative text-[12px] text-[#B1B6C6] font-bold leading-4 text-gray-400  whitespace-nowrap mt-[30px]">
            Jackpot Value
          </div>
          <div className="flex justify-between w-full">
            <div className="relative w-full gap-3 mt-3  sm:mt-[0px] flex items-center justify-center text-[34px] font-bold text-center text-blue-300 ">
              <img className=" w-[60px] h-[60px]" src="/JV.png" />
              {amount ? toFixed(amount?.toString(), 0) : '--'}
              {' ' + JackpotToken}
            </div>
          </div>
          <div className="text-[#B1B6C6] mt-4 flex gap-1 font-[700] text-[12px]">
            Minimum Trade Notional Size*:
            <div className="text-[#fff]">
              {minSize ? toFixed(minSize, 2) : '--'} ARB or USDC,
            </div>{' '}
          </div>
          <p className="text-[#B1B6C6] font-[700] text-[12px]">
            {' '}
            win upto 10 ARB by just placing a trade
          </p>
        </div>
        <div className="text-[#B1B6C6] mt-[-7px]  gap-1 font-[700] text-[12px] text-center">
          *Notional trade Size: Trade Size × ((Payout% × 2)/100), <br />
          eg. if you place a 20 USDC trade on ETH/USD market when the payout was{' '}
          {/* <br /> */}
          80% then your notional trade size will be 20 × ((80 × 2)/100) ={' '}
          <span className="text-[#fff]">32 USDC</span>
        </div>
      </>
    );
  }
  return (
    <div
      className={[
        'relative flex sm:w-full  flex-col items-center overflow-hidden rounded-[12px] px-[15px] py-[12px] w-[680px] h-[200px]  nb-image min-w-fit h-[250px]',
        props.className,
      ].join(' ')}
    >
      <button
        onClick={() => setIsOpen(true)}
        className="relative mt-4 flex  gap-1 self-end items-center"
      >
        {/* <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c918dc20adb64f78c725558364a049f97b9c2d04ba6e3e9d5e946ec1ee5c8b34?"
          className=" -mt-[1px] items-center w-[12px] justify-center object-contain object-center  max-w-full overflow-hidden aspect-square shrink-0"
        /> */}
        {/* <div className="self-start text-[12px] font-bold leading-4 text-right text-gray-400 grow whitespace-nowrap hover:underline">
          How it works
        </div> */}
      </button>
      <div className="relative mt-[5%] text-[16px] text-[#B1B6C6] font-bold leading-4 text-gray-400  whitespace-nowrap mt-11 max-md:mt-10">
        Jackpot Value
      </div>
      <div className="flex justify-between w-full">
        <div className="relative w-full gap-3 mt-1 flex items-center justify-center text-[45px] font-bold text-center text-blue-300 ">
          <img className=" w-[60px] h-[60px]" src="/JV.png" />
          {amount ? toFixed(amount?.toString(), 0) : '--'}
          {' ' + JackpotToken}
        </div>
      </div>
      <div className="text-[#B1B6C6] mt-4 flex gap-1 font-[700] text-[12px]">
        Minimum Trade Notional Size*:
        <div className="text-[#fff]">
          {minSize ? toFixed(minSize, 2) : '--'} ARB or USDC,
        </div>{' '}
        win upto 10 ARB by just placing a trade
      </div>
      <div className="text-[#B1B6C6] mt-4  gap-1 font-[700] text-[12px] text-center">
        *Notional trade Size: Trade Size × ((Payout% × 2)/100), <br />
        eg. if you place a 20 USDC trade on ETH/USD market when the payout was{' '}
        {/* <br /> */}
        80% then your notional trade size will be 20 × ((80 × 2)/100) ={' '}
        <span className="text-[#fff]">32 USDC</span>
      </div>
    </div>
  );
}

const format = (s) => {
  const ob = {
    seconds: 'secs',
    minutes: 'mins',
    hours: 'hours',
  };
  return ob?.[s] ?? s;
};
const dummy = {
  eligible_trades_for_jackpot: 1,
  user_jackpots_won: 3,
  total_jackpot_amount: 0,
};
function JackpotSummary(props) {
  const account = useAccount();
  const { data } = useSWR(`jackpotsummary`, {
    fetcher: async () => {
      if (!account?.address) return null;
      const response = await axios.get(
        `${baseUrl}jackpot/summary/?environment=${
          isTestnet ? 421614 : 42161
        }&order_by=-close_time&user_address=${account.address}`
      );
      // console.log(response.data, "response");
      return response.data;
    },
    refreshInterval: 1000,
  });
  // if (!account?.address) return <></>;
  // if (!data) {
  //   return (
  //     <Skeleton
  //       variant="rectangular"
  //       className="!w-[340px] !h-[70px] !rounded-md"
  //     />
  //   );
  // }
  return (
    <DataWrapper
      className={[
        'flex items-center justify-center bg-[#171722] py-[15px] sm:py-[10px] rounded-[20px] ',
        props.sm ? 'sm:hidden' : '',
      ].join(' ')}
    >
      <Col
        headClass="text-[#B1B6C6] nowrap sm:text-[12px] sm:px-5  text-[14px] font-[500] px-6 "
        className="br-jackpot"
        descClass="text-[#C3C2D4] nowrap sm:text-[12px] sm:px-5  text-[14px] font-[500] px-6 "
        head={'Eligible trades'}
        desc={data?.eligible_trades_for_jackpot || '-'}
      />
      <Col
        headClass="text-[#B1B6C6] nowrap  sm:text-[12px] sm:px-5 text-[14px] font-[500] px-6 "
        className="br-jackpot"
        descClass="text-[#C3C2D4] nowrap sm:text-[12px] sm:px-5  text-[14px] font-[500] px-6 "
        head={'Jackpots Won'}
        desc={data?.user_jackpots_won || '-'}
      />
      <Col
        headClass="text-[#B1B6C6] nowrap sm:text-[12px] sm:px-5  text-[14px] font-[500] px-6 "
        head={'Winnings'}
        descClass="text-green nowrap sm:text-[12px] sm:px-5  text-[14px] font-bold px-6"
        desc={
          data?.total_jackpot_amount ? `${data?.total_jackpot_amount} ARB` : '-'
        }
      />
    </DataWrapper>
  );
}

function RecentJackPotTimer({ recentTime }) {
  const timer = useTimer2(recentTime);
  let timerCols = Object.entries(timer).splice(1); //delete first col, as its the distance
  if (!timerCols[0][1]) {
    // if not days remove them also
    timerCols = timerCols.splice(1);
  }
  const navigate = useNavigate();
  const isMobile = useMedia('(max-width:600px)');
  if (isMobile) {
    return (
      <div className="flex text-[#B1B6C6]  items-center justify-center gap-[4vw] bg-[#141823] rounded-[8px] w-full py-5">
        {recentTime ? (
          <>
            <div className="font-[500] text-[12px]">Since the last jackpot</div>
            <div className="font-[700] text-[16px] text-1">
              {timerCols.map(([k, v]) => v).join(':')}
            </div>
          </>
        ) : (
          <div className="font-[500] text-[12px]">No Jackpots yet!</div>
        )}
        <button
          className=" bg-[#3772FF] h-[22px] text-[14px] w-[60px] font-[600] text-1 rounded-sm "
          onClick={() => {
            navigate('slots');
          }}
        >
          Trade
        </button>{' '}
      </div>
    );
  }
  return (
    <div className="items-center bg-[#141823] pt-[30px] flex max-w-[676px] flex-col pt-11 pb-6 px-16 rounded-lg max-md:px-5 dd">
      {recentTime ? (
        <div className="flex w-[214px] max-w-full flex-col items-center">
          <div className="text-sm text-[#B1B6C6] text-[14px] mb-[15px] font-medium leading-6 text-gray-400 whitespace-nowrap">
            Since the last jackpot
          </div>
          <div className="flex  gap-5">
            {timerCols.map((s, idx) => {
              return (
                <div
                  key={idx}
                  className="flex flex-col min-w-[45px] gap-4 items-center"
                >
                  <div className="text-[34px] font-bold leading-10 text-white">
                    {s[1]?.toString()?.padStart(2, '0')}{' '}
                  </div>
                  <div className=" text-[18px] font-medium  text-white capitalize">
                    {+s[1] == 1 ? format(s[0]).slice(0, -1) : format(s[0])}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="items-stretch bg-[#3772FF] h-[32px] text-[14px] justify-center py-2 text-sm font-bold leading-4 text-center text-gray-900 capitalize bg-blue-300 rounded-[8px] shadow-sm whitespace-nowrap mt-5 px-7 max-md:px-5"
            onClick={() => {
              navigate('slots');
            }}
          >
            Trade
          </button>
        </div>
      ) : (
        <span className="text-f20 text-[#B1B6C6] font-[500]">
          No Jackpot placed yet!
        </span>
      )}
    </div>
  );
}

const CircleAroundPicture = () => {
  return (
    <svg
      width="45"
      height="45"
      className="sm:w-[45px] sm:h-[45px] h-[77px] w-[77px] "
      viewBox="0 0 77 77"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M61.8633 10.458C68.5591 16.0279 73.0396 23.811 74.4936 32.3984"
        stroke="#A3E3FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
      <path
        d="M43.6172 2.36182C47.4748 2.90243 51.2201 4.06068 54.7095 5.79208"
        stroke="#A3E3FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
      <path
        d="M75 38.5C75 45.7175 72.8598 52.7728 68.85 58.774C64.8401 64.7751 59.1408 69.4524 52.4728 72.2144C45.8047 74.9764 38.4673 75.699 31.3885 74.291C24.3098 72.8829 17.8075 69.4074 12.704 64.3039C7.60043 59.2003 4.12489 52.698 2.71683 45.6193C1.30877 38.5405 2.03144 31.2031 4.79344 24.535C7.55545 17.867 12.2327 12.1677 18.2339 8.15785C24.235 4.14804 31.2903 2.00781 38.5078 2.00781"
        stroke="#3772FF"
        stroke-width="3"
        stroke-miterlimit="10"
      />
    </svg>
  );
};
