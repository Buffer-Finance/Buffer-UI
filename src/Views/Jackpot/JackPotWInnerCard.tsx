import * as React from 'react';
import { useAccount } from 'wagmi';
import ReactTimeAgo from 'react-time-ago';
export const formatAddress = (ads) =>
  ads.substr(0, 4) + '....' + ads.substr(-4);

export const JackpotDecimals = 18;
export const JackpotToken = 'ARB';

import { TradeType } from '@Views/TradePage/type';
import { UpDownChip } from '@Views/TradePage/Views/AccordionTable/UpDownChip';
import { useHighestTierNFT2 } from '@Hooks/useNFTGraph2';
import { Link } from 'react-router-dom';
import { Skeleton } from '@mui/material';
import { divide } from '@Utils/NumString/stringArithmatics';

function JackPotWinnerCard({ bet }) {
  console.log(`JackPotWInnerCard-bet.user_address: `, bet);
  const { address } = useAccount();

  return (
    <div className="justify-center items-stretch bg-slate-800 flex max-w-[360px] flex-col px-4 py-3 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {/* <Gravatar
            email={bet.user_address + '@web3.com'}
            size={20}
            className=" !w-[18px] !h-[18px] rounded-full"
          /> */}
          <div className="text-xs leading-6 text-slate-300">
            {/* {formatAddress(bet.user_address)} */}
          </div>
        </div>
        <div className="flex a12:hidden">
          <div className="text-xs font-medium leading-4 text-gray-400 grow whitespace-nowrap">
            Bet&nbsp;:
          </div>
          <div className="flex items-center gap-1 max-h-fit">
            {/* <Display
              className="!text-xs !text-1 ml-[2px]"
              data={divide(bet.wager, token.decimals)}
            /> */}
            {/* <img
              title={token.name}
              className="w-[11.64px] h-[12.07px]"
              src={token.logo}
            /> */}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-2">
        <div className="flex grow basis-[0%] flex-col items-stretch">
          <div className="flex items-center gap-2 ">
            <div className="flex b12:hidden">
              <div className="text-xs font-medium leading-4 text-gray-400 grow whitespace-nowrap">
                Bet&nbsp;:
              </div>
              <div className="flex items-center gap-1 max-h-fit">
                {/* <Display
                  className="!text-xs !text-1 ml-[2px]"
                  data={divide(bet.wager, token.decimals)}
                /> */}
                {/* <img
                  title={token.name}
                  className="w-[11.64px] h-[12.07px]"
                  src={token.logo}
                /> */}
              </div>
            </div>
            <div className="flex">
              <div className="text-xs font-medium leading-4 text-gray-400 grow whitespace-nowrap">
                Win&nbsp;:
              </div>
              <span className="text-xs text-lime-400 whitespace-nowrap ">
                &nbsp;
                {/* {toFixed(divide(bet.jackpot_amount, JackpotDecimals), 2) +
                  ' ' +
                  JackpotToken} */}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <img
            loading="lazy"
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/2bc6776ff6ce7e4b82e357ae7264626195ba858b10fa8bc666e49bc88cb0afa3?"
            className="aspect-square  w-2.5 fill-gray-400 stroke-[0.5px] stroke-gray-400 overflow-hidden max-w-full "
          />
          <div className="text-xs font-medium leading-4 text-gray-400 whitespace-nowrap">
            {/* <ReactTimeAgo date={1710394831000} date={bet.bet_init_timestamp * 1000} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JackPotWinnerCard;

export const UserCard: React.FC<{ bet: TradeType; isUser: boolean }> = ({
  bet,
  isUser,
}) => {
  console.log(`JackPotWInnerCard-bet: `, bet);
  if (!bet?.market)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-full !h-[45px] !min-h-[45px]  !rounded-md !bg-[#c3c2d414]"
      />
    );
  console.log(`JackPotWInnerCard-bet.user_address: `, bet.user_address);
  const nft = useHighestTierNFT2(bet.user_address);
  const parsed = bet.jackpot_amount / 1e18;
  console.log(`JackPotWInnerCard-parsed: `, bet);
  return (
    <div className="bg-[#232334] flex flex-col p-4 text-[#C3C2D4] text-f12 font-[500] rounded-sm">
      <div className="flex justify-between items-center">
        <div className="flex ">
          <Link to={`/profile?user_address=${bet.user_address}`}>
            <img
              src={
                nft.highestTierNFT?.nftImage
                  ? 'https://gateway.pinata.cloud/ipfs/' +
                    nft.highestTierNFT?.nftImage.split('://')[1]
                  : '/NFT-ph.png'
              }
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/NFT-ph.png';
                e.currentTarget.classList.remove('img-loading');
              }}
              loading="lazy"
              className="w-[20px] mr-2 h-[20px] rounded-full object-contain"
            />
          </Link>
          <div className="flex">
            <div className="flex items-end ">
              <span className=" leading-[21px]">Bet:</span>&nbsp;
              <div className="text-1 text-f14">
                {(+divide(bet.trade_size, 18)).toFixed(2)} ARB
              </div>
            </div>
            <a
              href={`https://sepolia.arbiscan.io/tx/${bet.jackpot_txn_hash}`}
              target="_blank"
              className="hover:underline flex items-center gap-2 ml-2 text-[#808191] hover:text-buffer-blue"
            >
              <OpenInNew />
            </a>
          </div>{' '}
        </div>
        <ReactTimeAgo date={bet.open_timestamp * 1000} />
      </div>
      <div className="flex items-center justify-between mt-1">
        <div className="flex text-f14">
          {bet.market.token0}-{bet.market.token1}
          <div className="mt-[3px] ml-[4px]">
            <UpDownChipSmm isUp={bet.is_above} />
          </div>
        </div>
        <div className="flex items-end">
          <span className=" leading-[21px]">Win:&nbsp;</span>
          <div className="text-green font-[500] text-f14">
            {parsed.toFixed(2)} ARB
          </div>
        </div>{' '}
      </div>
    </div>
  );
};

const OpenInNew = () => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.42714 0C6.13925 0 5.87815 0.174107 5.76657 0.441964C5.65499 0.709821 5.71747 1.01562 5.92055 1.22098L6.84445 2.14286L3.78041 5.20982C3.50145 5.48884 3.50145 5.94197 3.78041 6.22098C4.05936 6.5 4.51239 6.5 4.79134 6.22098L7.85539 3.15402L8.77929 4.07812C8.9846 4.28348 9.29034 4.34375 9.55813 4.23214C9.82593 4.12054 10 3.86161 10 3.57143V0.714286C10 0.319196 9.68087 0 9.28587 0H6.42714ZM1.78532 0.714286C0.798929 0.714286 0 1.51339 0 2.5V8.21429C0 9.20089 0.798929 10 1.78532 10H7.49833C8.48471 10 9.28364 9.20089 9.28364 8.21429V6.42857C9.28364 6.03348 8.96452 5.71429 8.56952 5.71429C8.17451 5.71429 7.85539 6.03348 7.85539 6.42857V8.21429C7.85539 8.41071 7.69471 8.57143 7.49833 8.57143H1.78532C1.58893 8.57143 1.42825 8.41071 1.42825 8.21429V2.5C1.42825 2.30357 1.58893 2.14286 1.78532 2.14286H3.57063C3.96563 2.14286 4.28476 1.82366 4.28476 1.42857C4.28476 1.03348 3.96563 0.714286 3.57063 0.714286H1.78532Z"
        fill="currentColor"
      />
    </svg>
  );
};

const UpDownChipSmm = ({ isUp }) => {
  if (isUp) {
    return (
      <svg
        width="28"
        height="15"
        viewBox="0 0 28 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 3.25351C0 1.67562 1.27913 0.396484 2.85703 0.396484H25.143C26.7209 0.396484 28 1.67562 28 3.25351V11.5395C28 13.1174 26.7209 14.3965 25.143 14.3965H2.85702C1.27913 14.3965 0 13.1174 0 11.5395V3.25351Z"
          fill="#303044"
        />
        <g clip-path="url(#clip0_100_1142)">
          <path
            d="M6.26282 6.2009C6.20556 6.13063 6.12016 6.0899 6.03004 6.0899C5.93991 6.0899 5.85452 6.13063 5.79726 6.2009L3.17844 9.72697C3.11231 9.81602 3.10167 9.93514 3.15096 10.0347C3.20025 10.1342 3.30101 10.1971 3.41122 10.1971H8.64884C8.75907 10.1971 8.85982 10.1342 8.90913 10.0347C8.95841 9.93514 8.94775 9.81602 8.88163 9.72697L6.26282 6.2009Z"
            fill="#3FB68B"
          />
        </g>
        <path
          d="M10.2764 7.75995V2.71995C10.2764 2.63995 10.3164 2.59995 10.3964 2.59995H11.6684C11.7484 2.59995 11.7884 2.63995 11.7884 2.71995V7.74795C11.7884 8.41195 11.9364 8.90795 12.2324 9.23595C12.5284 9.56395 12.9404 9.72795 13.4684 9.72795C13.9964 9.72795 14.4084 9.56395 14.7044 9.23595C15.0004 8.90795 15.1484 8.41195 15.1484 7.74795V2.71995C15.1484 2.63995 15.1884 2.59995 15.2684 2.59995H16.5404C16.6204 2.59995 16.6604 2.63995 16.6604 2.71995V7.75995C16.6604 8.79995 16.3684 9.61995 15.7844 10.2199C15.2084 10.8199 14.4364 11.1199 13.4684 11.1199C12.5004 11.1199 11.7244 10.8199 11.1404 10.2199C10.5644 9.61995 10.2764 8.79995 10.2764 7.75995ZM17.9321 13.2559V5.09595C17.9321 5.01595 17.9721 4.97595 18.0521 4.97595H19.2521C19.3321 4.97595 19.3721 5.01595 19.3721 5.09595V5.46795C19.8761 5.05995 20.4521 4.85595 21.1001 4.85595C21.9161 4.85595 22.5761 5.13995 23.0801 5.70795C23.5841 6.26795 23.8361 7.02795 23.8361 7.98795C23.8361 8.94795 23.5841 9.71195 23.0801 10.2799C22.5761 10.8399 21.9161 11.1199 21.1001 11.1199C20.4521 11.1199 19.8761 10.9199 19.3721 10.5199V13.2559C19.3721 13.3359 19.3321 13.3759 19.2521 13.3759H18.0521C17.9721 13.3759 17.9321 13.3359 17.9321 13.2559ZM19.7081 6.67995C19.4361 7.02395 19.3001 7.45995 19.3001 7.98795C19.3001 8.51595 19.4361 8.95595 19.7081 9.30795C19.9801 9.65195 20.3481 9.82395 20.8121 9.82395C21.2761 9.82395 21.6441 9.65195 21.9161 9.30795C22.1881 8.95595 22.3241 8.51595 22.3241 7.98795C22.3241 7.45995 22.1881 7.02395 21.9161 6.67995C21.6441 6.32795 21.2761 6.15195 20.8121 6.15195C20.3481 6.15195 19.9801 6.32795 19.7081 6.67995Z"
          fill="#3FB68B"
        />
        <defs>
          <clipPath id="clip0_100_1142">
            <rect
              width="6.10396"
              height="4.6669"
              fill="white"
              transform="translate(3.15625 5.3246)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  } else {
    return (
      <svg
        width="45"
        height="14"
        viewBox="0 0 45 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 2.85703C0 1.27913 1.27913 0 2.85703 0H42.143C43.7209 0 45 1.27913 45 2.85703V11.143C45 12.7209 43.7209 14 42.143 14H2.85702C1.27913 14 0 12.7209 0 11.143V2.85703Z"
          fill="#303044"
        />
        <g clip-path="url(#clip0_100_1128)">
          <path
            d="M5.677 8.99623C5.73426 9.0665 5.81966 9.10722 5.90978 9.10722C5.99991 9.10722 6.0853 9.0665 6.14256 8.99623L8.76138 5.47015C8.82751 5.38111 8.83815 5.26199 8.78886 5.16244C8.73957 5.06289 8.63881 5 8.5286 5H3.29098C3.18075 5 3.08 5.06289 3.03069 5.16244C2.98141 5.26199 2.99207 5.38111 3.05819 5.47015L5.677 8.99623Z"
            fill="#FF5353"
          />
        </g>
        <path
          d="M10.4684 10.8799V2.71995C10.4684 2.63995 10.5084 2.59995 10.5884 2.59995H13.1324C14.2684 2.59995 15.2084 2.95995 15.9524 3.67995C16.7044 4.39995 17.0804 5.43995 17.0804 6.79995C17.0804 8.15995 16.7044 9.19995 15.9524 9.91995C15.2084 10.6399 14.2684 10.9999 13.1324 10.9999H10.5884C10.5084 10.9999 10.4684 10.9599 10.4684 10.8799ZM13.0604 3.99195H11.9804V9.60795H13.0604C13.8044 9.60795 14.4004 9.37195 14.8484 8.89995C15.2964 8.42795 15.5204 7.72795 15.5204 6.79995C15.5204 5.87195 15.2964 5.17195 14.8484 4.69995C14.4004 4.22795 13.8044 3.99195 13.0604 3.99195ZM18.7422 10.2319C18.1342 9.63995 17.8302 8.89195 17.8302 7.98795C17.8302 7.08395 18.1342 6.33595 18.7422 5.74395C19.3582 5.15195 20.1262 4.85595 21.0462 4.85595C21.9662 4.85595 22.7302 5.15195 23.3382 5.74395C23.9542 6.33595 24.2622 7.08395 24.2622 7.98795C24.2622 8.89195 23.9542 9.63995 23.3382 10.2319C22.7302 10.8239 21.9662 11.1199 21.0462 11.1199C20.1262 11.1199 19.3582 10.8239 18.7422 10.2319ZM19.8342 6.65595C19.5222 6.99195 19.3662 7.43595 19.3662 7.98795C19.3662 8.53995 19.5222 8.98395 19.8342 9.31995C20.1462 9.65595 20.5502 9.82395 21.0462 9.82395C21.5422 9.82395 21.9462 9.65595 22.2582 9.31995C22.5702 8.98395 22.7262 8.53995 22.7262 7.98795C22.7262 7.43595 22.5702 6.99195 22.2582 6.65595C21.9462 6.31995 21.5422 6.15195 21.0462 6.15195C20.5502 6.15195 20.1462 6.31995 19.8342 6.65595ZM33.6159 5.15595L31.8399 10.8799C31.8159 10.9599 31.7639 10.9999 31.6839 10.9999H30.3759C30.2959 10.9999 30.2439 10.9599 30.2199 10.8799L29.1279 7.19595L28.0359 10.8799C28.0119 10.9599 27.9599 10.9999 27.8799 10.9999H26.5719C26.4919 10.9999 26.4399 10.9599 26.4159 10.8799L24.6399 5.15595C24.6319 5.12395 24.6279 5.09195 24.6279 5.05995C24.6279 5.00395 24.6599 4.97595 24.7239 4.97595H25.9599C26.0479 4.97595 26.1039 5.01595 26.1279 5.09595L27.2079 9.13995L28.3719 5.38395C28.3959 5.30395 28.4399 5.26395 28.5039 5.26395H29.7519C29.8159 5.26395 29.8599 5.30395 29.8839 5.38395L31.0479 9.13995L32.1279 5.09595C32.1519 5.01595 32.2079 4.97595 32.2959 4.97595H33.5319C33.5959 4.97595 33.6279 5.00395 33.6279 5.05995C33.6279 5.09195 33.6239 5.12395 33.6159 5.15595ZM34.3501 10.8799V5.09595C34.3501 5.01595 34.3901 4.97595 34.4701 4.97595H35.6701C35.7501 4.97595 35.7901 5.01595 35.7901 5.09595V5.52795C36.3341 5.07995 36.9381 4.85595 37.6021 4.85595C38.2581 4.85595 38.7701 5.03995 39.1381 5.40795C39.5141 5.76795 39.7021 6.25995 39.7021 6.88395V10.8799C39.7021 10.9599 39.6621 10.9999 39.5821 10.9999H38.3821C38.3021 10.9999 38.2621 10.9599 38.2621 10.8799V7.39995C38.2621 6.56795 37.9181 6.15195 37.2301 6.15195C36.8141 6.15195 36.4701 6.31995 36.1981 6.65595C35.9261 6.98395 35.7901 7.48395 35.7901 8.15595V10.8799C35.7901 10.9599 35.7501 10.9999 35.6701 10.9999H34.4701C34.3901 10.9999 34.3501 10.9599 34.3501 10.8799Z"
          fill="#FF5353"
        />
        <defs>
          <clipPath id="clip0_100_1128">
            <rect
              width="6.10396"
              height="4.6669"
              fill="white"
              transform="translate(3.15625 5.3246)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }
};
