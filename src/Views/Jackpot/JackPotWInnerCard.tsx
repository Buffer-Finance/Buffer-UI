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
  if (!bet.market)
    return (
      <Skeleton
        variant="rectangular"
        className="!w-full !h-[45px] !rounded-md !bg-[#c3c2d414]"
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
            Bet:&nbsp;
            <div className="text-1">
              {(+divide(bet.trade_size, 18)).toFixed(2)} ARB
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
        <div className="flex">
          {bet.market.token0}-{bet.market.token1}
          <div className="mt-[3px] ml-[4px]">
            <UpDownChipSmm isUp={bet.is_above} />
          </div>
        </div>
        <div className="flex">
          Win:&nbsp;
          <div className="text-green">{parsed.toFixed(2)} ARB</div>
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
        width="26"
        height="14"
        viewBox="0 0 26 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.835938 2.98642C0.835938 1.40853 2.11507 0.129395 3.69296 0.129395H22.988C24.5659 0.129395 25.8451 1.40853 25.8451 2.98642V10.8321C25.8451 12.41 24.5659 13.6891 22.988 13.6891H3.69296C2.11507 13.6891 0.835938 12.41 0.835938 10.8321V2.98642Z"
          fill="#303044"
        />
        <g clip-path="url(#clip0_160_483)">
          <path
            d="M7.26282 5.80441C7.20556 5.73414 7.12016 5.69342 7.03004 5.69342C6.93991 5.69342 6.85452 5.73414 6.79726 5.80441L4.17844 9.33049C4.11231 9.41953 4.10167 9.53865 4.15096 9.6382C4.20025 9.73775 4.30101 9.80064 4.41122 9.80064H9.64884C9.75907 9.80064 9.85982 9.73775 9.90913 9.6382C9.95841 9.53865 9.94775 9.41953 9.88163 9.33049L7.26282 5.80441Z"
            fill="#3FB68B"
          />
        </g>
        <path
          d="M13.7669 9.69742C13.272 9.69742 12.8335 9.59406 12.4513 9.38734C12.0755 9.17435 11.7842 8.87053 11.5775 8.47587C11.3707 8.08122 11.2674 7.61139 11.2674 7.0664V3.11985C11.2674 3.05721 11.2987 3.02589 11.3613 3.02589H12.3574C12.42 3.02589 12.4513 3.05721 12.4513 3.11985V7.057C12.4513 7.57694 12.5672 7.96533 12.799 8.22217C13.0308 8.47901 13.3534 8.60743 13.7669 8.60743C14.1803 8.60743 14.5029 8.47901 14.7347 8.22217C14.9665 7.96533 15.0824 7.57694 15.0824 7.057V3.11985C15.0824 3.05721 15.1137 3.02589 15.1763 3.02589H16.1724C16.235 3.02589 16.2663 3.05721 16.2663 3.11985V7.0664C16.2663 7.61139 16.163 8.08122 15.9563 8.47587C15.7495 8.87053 15.4551 9.17435 15.073 9.38734C14.6971 9.59406 14.2617 9.69742 13.7669 9.69742ZM17.5722 11.464C17.5095 11.464 17.4782 11.4326 17.4782 11.37V4.98037C17.4782 4.91772 17.5095 4.8864 17.5722 4.8864H18.5118C18.5745 4.8864 18.6058 4.91772 18.6058 4.98037V5.27166C19.0004 4.95218 19.4515 4.79243 19.9589 4.79243C20.3786 4.79243 20.7513 4.89266 21.0771 5.09312C21.4028 5.29358 21.6534 5.57861 21.8288 5.94821C22.0105 6.3178 22.1013 6.75005 22.1013 7.24493C22.1013 7.73981 22.0105 8.17205 21.8288 8.54165C21.6534 8.91125 21.4028 9.19628 21.0771 9.39673C20.7513 9.59719 20.3786 9.69742 19.9589 9.69742C19.4515 9.69742 19.0004 9.54081 18.6058 9.2276V11.37C18.6058 11.4326 18.5745 11.464 18.5118 11.464H17.5722ZM19.7334 8.6826C20.0967 8.6826 20.3849 8.54791 20.5978 8.27855C20.8108 8.00292 20.9173 7.65838 20.9173 7.24493C20.9173 6.83148 20.8108 6.49007 20.5978 6.22071C20.3849 5.94508 20.0967 5.80726 19.7334 5.80726C19.37 5.80726 19.0819 5.94508 18.8689 6.22071C18.6559 6.49007 18.5494 6.83148 18.5494 7.24493C18.5494 7.65838 18.6559 8.00292 18.8689 8.27855C19.0819 8.54791 19.37 8.6826 19.7334 8.6826Z"
          fill="#3FB68B"
        />
        <defs>
          <clipPath id="clip0_160_483">
            <rect
              width="6.10396"
              height="4.6669"
              fill="white"
              transform="translate(4.15625 4.92811)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  } else {
    return (
      <svg
        width="37"
        height="15"
        viewBox="0 0 37 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 3.85703C0 2.27913 1.27913 1 2.85703 1H34.143C35.7209 1 37 2.27913 37 3.85703V12.143C37 13.7209 35.7209 15 34.143 15H2.85703C1.27913 15 0 13.7209 0 12.143V3.85703Z"
          fill="#303044"
        />
        <g clip-path="url(#clip0_160_1530)">
          <path
            d="M6.26282 9.71871C6.20556 9.78898 6.12016 9.8297 6.03004 9.8297C5.93991 9.8297 5.85452 9.78898 5.79726 9.71871L3.17844 6.19263C3.11231 6.10359 3.10167 5.98447 3.15096 5.88492C3.20025 5.78538 3.30101 5.72248 3.41122 5.72248H8.64884C8.75907 5.72248 8.85982 5.78538 8.90913 5.88492C8.95841 5.98447 8.94775 6.10359 8.88163 6.19263L6.26282 9.71871Z"
            fill="#FF5353"
          />
        </g>
        <path
          d="M10.3989 10.6035C10.3363 10.6035 10.305 10.5721 10.305 10.5095V4.11985C10.305 4.05721 10.3363 4.02589 10.3989 4.02589H12.4004C12.9767 4.02589 13.4998 4.14804 13.9696 4.39235C14.4394 4.63666 14.8122 5.00626 15.0878 5.50114C15.3634 5.99603 15.5012 6.60054 15.5012 7.31467C15.5012 8.02881 15.3634 8.63332 15.0878 9.1282C14.8122 9.62309 14.4394 9.99268 13.9696 10.237C13.4998 10.4813 12.9767 10.6035 12.4004 10.6035H10.3989ZM12.344 9.51346C12.9329 9.51346 13.4027 9.32866 13.7535 8.95907C14.1043 8.58947 14.2797 8.04134 14.2797 7.31467C14.2797 6.58801 14.1043 6.03988 13.7535 5.67028C13.4027 5.30068 12.9329 5.11588 12.344 5.11588H11.4889V9.51346H12.344ZM18.6875 10.6974C18.2114 10.6974 17.7823 10.5941 17.4002 10.3873C17.018 10.1744 16.7173 9.88306 16.4981 9.51346C16.2788 9.1376 16.1692 8.71476 16.1692 8.24493C16.1692 7.7751 16.2788 7.35539 16.4981 6.98579C16.7173 6.60993 17.018 6.31864 17.4002 6.11192C17.7823 5.89893 18.2114 5.79243 18.6875 5.79243C19.1636 5.79243 19.5927 5.89893 19.9748 6.11192C20.3569 6.31864 20.6576 6.60993 20.8769 6.98579C21.0961 7.35539 21.2058 7.7751 21.2058 8.24493C21.2058 8.71476 21.0961 9.1376 20.8769 9.51346C20.6576 9.88306 20.3569 10.1744 19.9748 10.3873C19.5927 10.5941 19.1636 10.6974 18.6875 10.6974ZM18.6875 9.6826C19.0759 9.6826 19.3922 9.55105 19.6365 9.28794C19.8808 9.02484 20.003 8.67717 20.003 8.24493C20.003 7.81269 19.8808 7.46502 19.6365 7.20191C19.3922 6.93881 19.0759 6.80726 18.6875 6.80726C18.2991 6.80726 17.9827 6.93881 17.7384 7.20191C17.4941 7.46502 17.372 7.81269 17.372 8.24493C17.372 8.67717 17.4941 9.02484 17.7384 9.28794C17.9827 9.55105 18.2991 9.6826 18.6875 9.6826ZM22.9964 10.6035C22.9337 10.6035 22.893 10.5721 22.8742 10.5095L21.5023 6.08373C21.4835 6.02108 21.4741 5.97723 21.4741 5.95218C21.4741 5.90833 21.4992 5.8864 21.5493 5.8864H22.5172C22.561 5.8864 22.5892 5.8958 22.6017 5.91459C22.6205 5.92712 22.6362 5.94904 22.6487 5.98037L23.4944 9.147L24.4059 6.20588C24.4246 6.14324 24.4654 6.11192 24.528 6.11192H25.4677C25.5303 6.11192 25.571 6.14324 25.5898 6.20588L26.5013 9.147L27.347 5.98037C27.3595 5.94904 27.372 5.92712 27.3846 5.91459C27.4033 5.8958 27.4347 5.8864 27.4785 5.8864H28.4464C28.4965 5.8864 28.5215 5.90833 28.5215 5.95218C28.5215 5.97723 28.5121 6.02108 28.4933 6.08373L27.1215 10.5095C27.1089 10.5721 27.0682 10.6035 26.9993 10.6035H25.9751C25.9124 10.6035 25.8717 10.5721 25.8529 10.5095L24.9978 7.62476L24.1428 10.5095C24.124 10.5721 24.0832 10.6035 24.0206 10.6035H22.9964ZM29.1529 10.6035C29.0902 10.6035 29.0589 10.5721 29.0589 10.5095V5.98037C29.0589 5.91772 29.0902 5.8864 29.1529 5.8864H30.0925C30.1552 5.8864 30.1865 5.91772 30.1865 5.98037V6.31864C30.3932 6.1495 30.6093 6.02108 30.8348 5.93338C31.0604 5.83942 31.3172 5.79243 31.6054 5.79243C32.119 5.79243 32.52 5.93651 32.8081 6.22468C33.1025 6.50657 33.2498 6.89183 33.2498 7.38045V10.5095C33.2498 10.5721 33.2184 10.6035 33.1558 10.6035H32.2161C32.1535 10.6035 32.1222 10.5721 32.1222 10.5095V7.7845C32.1222 7.43996 32.0533 7.19252 31.9154 7.04217C31.7839 6.88556 31.5834 6.80726 31.3141 6.80726C30.9883 6.80726 30.719 6.93881 30.506 7.20191C30.293 7.45875 30.1865 7.85027 30.1865 8.37648V10.5095C30.1865 10.5721 30.1552 10.6035 30.0925 10.6035H29.1529Z"
          fill="#FF5353"
        />
        <defs>
          <clipPath id="clip0_160_1530">
            <rect
              width="6.10396"
              height="4.6669"
              fill="white"
              transform="matrix(1 0 0 -1 3.15625 10.595)"
            />
          </clipPath>
        </defs>
      </svg>
    );
  }
};
