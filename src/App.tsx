import {
  UpDownChipWOText,
  UpDownChipWOTextSm,
} from '@Views/TradePage/Views/AccordionTable/ShareModal/UpDownArrow';
import MemoBorder from './temp';
import { Timer10Sharp, TimerOutlined } from '@mui/icons-material';
import { TimerIcon } from '@SVG/Elements/TimerIcon';
import MemoTimerGIF from '@SVG/Elements/TimerGIF';
import MemoTrophyIcon from '@SVG/Elements/TrophyIcon';
import {
  Token,
  TokenWOName,
} from '@Views/TradePage/Views/AccordionTable/ShareModal/Token';
import ConfettiExplosion from 'react-confetti-explosion';
import React from 'react';

const App = () => {
  const address = '0xdsfasdfsadfsa';
  const isup = false;
  const [isExploding, setIsExploding] = React.useState(false);

  return (
    <>
      <div className="bg-[#171722] w-[360px] h-[200px] p-5">
        <div className="relative  m-auto h-[52px] w-[52px]">
          <MemoBorder className="absolute  left-1/2 -translate-x-1/2 -" />
          <img
            src="/DP.png"
            className="h-[40px] w-[40px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full absolute"
          />
        </div>
        <ConfettiExplosion
          particleSize={3}
          particleCount={300}
          duration={10000}
          zIndex={0}
          force={0.4}
          // width={600}
          // height={200}
        />
        <div className="flex justify-between mt-5">
          <div>
            <div className="flex items-center   ">
              <div className=" text-[#C3C2D4] font-bold text-[19px]">
                BTC-USD
              </div>
              <div className="bg-[#303044] rounded-md px-2 pr-3  flex items-center ml-3">
                <UpDownChipWOTextSm isUp={isup} />
                <div
                  className={` ml-2 font-bold text-f16 ${
                    isup ? 'text-green' : 'text-red'
                  }`}
                >
                  {isup ? 'Up' : 'Down'}
                </div>
              </div>
            </div>
            <div className="text-f15 text-[#C3C2D4] mt-1">
              {address.substring(0, 4) +
                '...' +
                address.substring(address.length - 4)}
            </div>
          </div>
          <div className="flex text-f18 items-center text-[#C3C2D4] gap-2">
            <MemoTimerGIF />
            {'12 mins'}
          </div>
        </div>
        <div className="flex justify-between mt-5">
          <div className=" flex gap-2">
            <MemoTrophyIcon />
            <div className="text-green font-bold text-f22 flex items-center gap-1">
              34.12
              <TokenWOName tokenName={'ARB'} />
            </div>
          </div>
          <div className="flex text-f18 font-bold items-center text-[#C3C2D4] gap-2">
            ROI 45%
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
