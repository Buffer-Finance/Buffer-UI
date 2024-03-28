import { useEffect, useRef, useState } from 'react';
import { JackpotButtons } from './JackpotButtons';
import styled from '@emotion/styled';
import { UpDownChip } from '../UpDownChip';
import MemoARBMonochrome from '@SVG/Elements/ARBMonochrome';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { TradeType } from '@Views/TradePage/type';
import { Skeleton } from '@mui/material';
import { Display } from '@Views/Common/Tooltips/Display';
import { divide } from '@Utils/NumString/stringArithmatics';
import { isABRouter } from '@Views/TradePage/config';

const BGImage = styled.div`
  background-image: url('/JackpotBG.png');
  background-repeat: round;
  padding: 25px 20px;
  padding-top: 22px;
  height: 100%;
`;
const JackpotBody: React.FC<{
  trade: (TradeType & { jackpotAmount: string }) | null;
}> = ({ trade }) => {
  const ref = useRef(null);

  if (!trade?.market)
    return (
      <div className="flex flex-col text-1 text-f16">
        Congrats you won the Jackpot!
        <div className="text-2 text-f14">
          Fetching jackpot details, this may take a while.
        </div>
      </div>
    );
  const token0 = trade?.market.token0;
  const token1 = trade?.market.token1;
  const isAb = isABRouter(trade.router);
  return (
    <div className="flex flex-col">
      <div className="text-[#C3C2D4] w-[380px] b400:-translate-x-[4%]  h-[199px] b400:scale-[0.95] origin-center  ">
        <BGImage ref={ref}>
          <div className="font-[600]   mt-6 text-[#B1B6C6] text-f15 w-full text-center">
            You won the Jackpot..
          </div>
          <div className="flex justify-between items-center mt-4">
            {trade ? (
              <div className="mr-4 font-[500] text-[20px] flex items-center  whitespace-nowrap ">
                {token0}-{token1}{' '}
                <UpDownChip
                  isUp={trade?.is_above}
                  upText={isAb ? 'Above' : 'Up'}
                  downText={isAb ? 'Below' : 'Down'}
                />
              </div>
            ) : (
              <Skeleton
                variant="rectangular"
                className="w-[120px] h-[25px] rounded-md"
              />
            )}
            <div className="flex text-[24px] items-center font-[700]  text-[#fff] ">
              <span className="text-[16px] font-[500] text-[#B1B6C6]">
                Bet:&nbsp;
              </span>{' '}
              <Display
                data={divide(trade.trade_size, 18)}
                className="!justify-start"
                // unit={poolInfo.token}
              />{' '}
              <img src="/ARBMonohrome.svg" className="w-[18px]  ml-2"></img>
            </div>
          </div>
          <div className="flex justify-center items-center mt-3 text-[#fff]">
            <div className="mr-4 font-[700] text-[36px]  flex items-center gap-2">
              <img className=" w-[50px] h-[45px]" src="/JV.png" />
              <Display
                data={divide(trade?.jackpotAmount, 18)}
                className="!justify-start"
                // unit={poolInfo.token}
              />
              <img src="/ARBMonohrome.svg" className="w-[28px]  ml-1"></img>
            </div>
          </div>
        </BGImage>
      </div>

      <JackpotButtons imageRef={ref} name="Jackpot Image" />
    </div>
  );
};

export { JackpotBody };
