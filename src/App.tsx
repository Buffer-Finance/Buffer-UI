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
import ConfettiExplosion from 'react-confetti-explosion';
import React, { useEffect } from 'react';
import MemoBorderSVG from './temp';
import MemoNFT from '@SVG/Elements/NFT';
import JSConfetti from 'js-confetti';

const jsConfetti = new JSConfetti();

// jsConfetti.addConfetti();

const App = () => {
  const address = '0xdsfasdfsadfsa';
  const isup = false;
  const [isExploding, setIsExploding] = React.useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsExploding(true);
    }, 6000);
  }, []);
  useEffect(() => {
    if (isExploding) {
      jsConfetti.addConfetti();
      setInterval(() => {
        jsConfetti.addConfetti();
      }, 2000);
      setTimeout(() => {
        const div = document.createElement('div');
        div.setAttribute('id', 'ready');
        document.body.append(div);
      }, 1000);
    }
  }, [isExploding]);
  return (
    <div className="relative ">
      <canvas id="custom_canvas" className="w-full h-full absolute"></canvas>

      <div className="bg-[#171722] w-[100%] h-[850px] p-[30px] ">
        <div className="relative  m-auto h-[246px] w-[246px]">
          <MemoBorderSVG className="absolute  left-1/2 -translate-x-1/2 -" />
          <MemoNFT className="h-[220px] w-[220px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full absolute" />
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
        <div className="flex justify-between mt-5">
          <div>
            <div className="flex items-center   ">
              <div className=" text-[#C3C2D4] font-bold text-[80px]">
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
            <div className="text-[60px] text-[#C3C2D4] mt-1">
              {address.substring(0, 4) +
                '...' +
                address.substring(address.length - 4)}
            </div>
          </div>
          <div className="flex text-[70px] items-center text-[#C3C2D4] gap-2">
            <MemoTimerGIF />
            {'12 mins'}
          </div>
        </div>
        <div className="flex justify-between mt-5">
          <div className=" flex gap-2">
            <MemoTrophyIcon />
            <div className="text-green font-bold text-[70px] flex items-center gap-1">
              34.12 ARB
            </div>
          </div>
          <div className="flex text-[60px] font-bold items-center text-[#C3C2D4] gap-2">
            ROI 45%
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
