import {
  UpDownChipWOText,
  UpDownChipWOTextSm,
} from '@Views/TradePage/Views/AccordionTable/ShareModal/UpDownArrow';
import MemoBorder from './temp';
import { Timer10Sharp, TimerOutlined } from '@mui/icons-material';
// import { TimerIcon } from '@SVG/Elements/TimerIcon';
import MemoTimerGIF from '@SVG/Elements/TimerGIF';
import MemoTrophyIcon from '@SVG/Elements/TrophyIcon';
import {
  Token,
  TokenWOName,
} from '@Views/TradePage/Views/AccordionTable/ShareModal/Token';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

import ConfettiExplosion from 'react-confetti-explosion';
import React, { useEffect } from 'react';
import MemoBorderSVG from './temp';
import MemoNFT from '@SVG/Elements/NFT';
import { Display } from '@Views/Common/Tooltips/Display';
import MemoABR_monochrome from '@SVG/Elements/ABR_monochrome';
import { formatDistance } from '@Hooks/Utilities/useStopWatch';
import { Variables } from '@Utils/Time';
import { useHighestTierNFT } from '@Hooks/useNFTGraph';
import MemoUSDC_monochrome from '@SVG/Elements/USDC_monochrome';

// jsConfetti.addConfetti();
const urlObject = Object.fromEntries(
  new URLSearchParams(window.location.search).entries()
);
const App = () => {
  const obj = {
    address: '0xdsfasdfsadfsa',
    isup: false,
    strike: '12231.00',
    pooltoken: 'ARB',
    roi: 45,
    payout: 34.12,
    secondsduration: 333,
  };

  const address = urlObject.user_address;
  const isup = urlObject.isAbove == 'true';
  console.log(`App-isup: `, isup);
  const strike = urlObject.strike;
  const pooltoken = urlObject.pooltoken;
  const roi = urlObject.roi;
  const payout = urlObject.payout;
  const secondsduration = urlObject.duration;

  const { width, height } = useWindowSize();

  const [isExploding, setIsExploding] = React.useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsExploding(true);
    }, 6000);
  }, []);
  const highestNFT = useHighestTierNFT({ userOnly: true });
  console.log(`App-highestNFT: `, highestNFT);
  useEffect(() => {
    if (isExploding) {
      setTimeout(() => {
        const div = document.createElement('div');
        div.setAttribute('id', 'ready');
        document.body.append(div);
      }, 4000);
    }
  }, [isExploding]);

  return (
    <div className="relative ">
      {isExploding && <Confetti width={width} height={height} />}

      <div className="bg-[#171722] w-[100%] h-[850px] py-[50px] px-[100px] ">
        <div className="flex items-center justify-center gap-[30px]">
          <div className="relative   h-[246px] w-[246px]">
            <MemoBorderSVG className="absolute  left-1/2 -translate-x-1/2 -" />
            {/* <MemoNFT /> */}
            {highestNFT.highestTierNFT ? (
              <img
                src={
                  'https://gateway.pinata.cloud/ipfs/' +
                  highestNFT.highestTierNFT?.nftImage.split('://')[1]
                }
                className="h-[220px] w-[220px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full absolute"
              />
            ) : (
              <img
                src={'/NFTPlaceHolder.png'}
                className="h-[220px] w-[220px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full absolute"
              />
            )}
          </div>
          <div className="text-[65px] font-[600] text-[#C3C2D4] mt-1">
            {address.substring(0, 4) +
              '...' +
              address.substring(address.length - 4)}
          </div>
        </div>
        {/* {isExploding && (
          // <ConfettiExplosion
          //   particleSize={3}
          //   particleCount={200}
          //   duration={10000}
          //   zIndex={0}
          //   force={0.4}
          //   // width={600}
          //   // height={200}
          // />
        )} */}
        <div className="flex justify-between mt-[40px] items-end">
          <div>
            <div className="flex items-center   ">
              <div className=" text-[#C3C2D4] font-bold text-[80px]  leading-tight">
                {urlObject.asset}
              </div>
              <div className="bg-[#303044]  px-[12px] rounded-[20px]  flex items-center ml-4">
                <UpDownChipWOTextSm isUp={isup} />
                <div
                  className={` ml-2 font-bold text-[50px] ${
                    isup ? 'text-green' : 'text-red'
                  }`}
                >
                  {isup ? 'Up' : 'Down'}
                </div>
              </div>
            </div>
            <div className="flex text-[50px] items-center  text-[#8F95A4] gap-2 mt-[-10px]">
              <MemoTimerGIF className="mt-[5px]" />
              {formatDistance(Variables(secondsduration))}
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center   ">
              <div className=" text-[#C3C2D4] font-bold text-[45px]  leading-tight">
                Strike Price
              </div>
            </div>
            <div className="flex text-[60px] items-center     text-[#C3C2D4] gap-2">
              <Display data={strike} />
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-[50px]">
          <div className=" flex gap-4 items-center">
            <div className="text-green font-bold text-[80px] flex items-center gap-2">
              <MemoTrophyIcon />
              {payout}
            </div>
            <MonoChromePoolToken pool={pooltoken} />
          </div>
          <div className="flex text-[76px] font-bold items-center text-[#C3C2D4] gap-2">
            ROI {roi}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

const MonoChromePoolToken: React.FC<{ pool: 'ARB' | 'USDC' }> = ({ pool }) => {
  if (pool == 'USDC') {
    return <MemoUSDC_monochrome />;
  }
  return <MemoABR_monochrome />;
};
