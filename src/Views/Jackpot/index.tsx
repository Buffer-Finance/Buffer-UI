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
import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import { useState } from 'react';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);
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
const Jackpot: React.FC<any> = ({}) => {
  const { highestTierNFT } = useHighestTierNFT({ userOnly: false });
  const { address } = useAccount();
  const data = {
    data: [bet],
  };

  return (
    <div className="flex gap-4 m-auto mt-6 sm:mx-4">
      <div className=" flex flex-col gap-5">
        <div className="flex items-center gap-5">
          <div className="relative w-[72px] h-[72px] sm:w-[38px] sm:h-[38px] ">
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
              : null}
          </div>
          <JackpotSummary />
        </div>
        <JackpotValueSeciont />
        <RecentJackPotTimer recentTime={1710394831} />
      </div>
      <div className="flex flex-col gap-5">
        <JackpotSummary sm />
        <RecentJackpots sm />
      </div>
    </div>
  );
};

export { Jackpot };

function RecentJackpots(props) {
  const [userTab, setUserTab] = useState(false);

  const headClass = '#B1B6C6';
  return (
    <div
      className={[
        'bg-[#141823] px-[25px] py-[18px] rounded-[12px]',
        props.sm ? 'sm:hidden' : '',
      ].join(' ')}
    >
      <div className="flex items-center gap-3 font-[600] text-[#B1B6C6] mb-3">
        <button
          onClick={() => {
            setUserTab(true);
          }}
          className={' text-f12 ' + (userTab ? 'text-1' : '')}
        >
          Previous Winners
        </button>
        <button
          onClick={() => {
            setUserTab(false);
          }}
          className={' text-f12 ' + (userTab ? '' : 'text-1')}
        >
          My Wins
        </button>
      </div>
      <UserCard bet={bet} isUser={userTab} />
    </div>
  );
}

const JackpotToken = 'ARB';
function JackpotValueSeciont(props) {
  const amount = '34443';
  return (
    <div
      className={[
        'relative flex sm:w-full  flex-col items-center overflow-hidden rounded-[12px] px-[15px] py-[12px] w-[680px] h-[200px]  nb-image min-w-fit',
        props.className,
      ].join(' ')}
    >
      <button className="relative mt-4 flex  gap-1 self-end items-center">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/c918dc20adb64f78c725558364a049f97b9c2d04ba6e3e9d5e946ec1ee5c8b34?"
          className=" -mt-[1px] items-center w-[12px] justify-center object-contain object-center  max-w-full overflow-hidden aspect-square shrink-0"
        />
        <div className="self-start text-[12px] font-bold leading-4 text-right text-gray-400 grow whitespace-nowrap">
          How it works
        </div>
      </button>
      <div className="relative mt-[5%] text-[16px] text-[#B1B6C6] font-bold leading-4 text-gray-400  whitespace-nowrap mt-11 max-md:mt-10">
        Jackpot Value
      </div>
      <div className="flex justify-between w-full">
        <div className="relative w-full gap-3 mt-3 flex items-center justify-center text-[45px] font-bold text-center text-blue-300 ">
          <img className=" w-[60px] h-[60px]" src="/JV.png" />
          {toFixed(amount?.toString(), 2)}
          {' ' + JackpotToken}
        </div>
      </div>
      <div className="text-[#B1B6C6] flex gap-1 font-[700] text-[14px]">
        Minimum Bet Size <div className="text-[#fff]">30 ARB</div>{' '}
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

function JackpotSummary(props) {
  return (
    <DataWrapper
      className={[
        'flex items-center justify-center bg-[#171722] py-[15px] rounded-[20px] ',
        props.sm ? 'sm:hidden' : '',
      ].join(' ')}
    >
      <Col
        headClass="text-[#B1B6C6] sm:text-[12px] sm:px-5  text-[14px] font-[500] px-6 "
        className="br-jackpot"
        descClass="text-[#C3C2D4] sm:text-[12px] sm:px-5  text-[14px] font-[500] px-6 "
        head={'No of bets'}
        desc={'34'}
      />
      <Col
        headClass="text-[#B1B6C6]  sm:text-[12px] sm:px-5 text-[14px] font-[500] px-6 "
        className="br-jackpot"
        descClass="text-[#C3C2D4] sm:text-[12px] sm:px-5  text-[14px] font-[500] px-6 "
        head={'Jackpot Won'}
        desc={'2'}
      />
      <Col
        headClass="text-[#B1B6C6] sm:text-[12px] sm:px-5  text-[14px] font-[500] px-6 "
        head={'Win'}
        descClass="text-green  sm:text-[12px] sm:px-5  text-[14px] font-bold px-6"
        desc={'100 ARB'}
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
  return (
    <div className="items-center bg-[#141823] pt-[30px] flex max-w-[676px] flex-col pt-11 pb-6 px-16 rounded-lg max-md:px-5 dd">
      {recentTime ? (
        <div className="flex w-[214px] max-w-full flex-col items-center">
          <div className="text-sm text-[#B1B6C6] text-[14px] mb-[30px] font-medium leading-6 text-gray-400 whitespace-nowrap">
            since the last jackpot
          </div>
          <div className="flex  gap-3">
            {timerCols.map((s, idx) => {
              return (
                <div
                  key={idx}
                  className="flex flex-col min-w-[45px] items-center"
                >
                  <div className="text-[34px] font-bold leading-10 text-white">
                    {s[1]}{' '}
                  </div>
                  <div className=" text-[18px] font-medium  text-white">
                    {format(s[0])}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className="items-stretch bg-[#3772FF] h-[32px] text-[14px] justify-center py-2 text-sm font-bold leading-4 text-center text-gray-900 capitalize bg-blue-300 rounded-[8px] shadow-sm whitespace-nowrap mt-7 px-7 max-md:px-5"
            onClick={() => {
              navigate('slots');
            }}
          >
            Trade
          </button>
        </div>
      ) : (
        <span>No Jackpot placed yet!</span>
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
