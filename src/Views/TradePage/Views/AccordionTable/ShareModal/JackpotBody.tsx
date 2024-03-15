import { useRef } from 'react';
import { JackpotButtons } from './JackpotButtons';
import styled from '@emotion/styled';
import { UpDownChip } from '../UpDownChip';
import MemoARBMonochrome from '@SVG/Elements/ARBMonochrome';

const BGImage = styled.div`
  background-image: url('/JackpotBG.png');
  background-repeat: round;
  padding: 25px 20px;
  padding-top: 22px;
  height: 100%;
`;

const JackpotBody: React.FC<any> = ({}) => {
  const ref = useRef(null);
  return (
    <div>
      <div className="text-[#C3C2D4] w-[380px] h-[199px]  origin-left ">
        <BGImage ref={ref}>
          <div className="font-[600] mt-6 text-[#B1B6C6] text-f15 w-full text-center">
            You won the Jackpot..
          </div>
          <div className="flex justify-center items-center mt-4">
            <div className="mr-4 font-[500] text-[20px] flex items-center ">
              ETH-USD <UpDownChip isUp={true} />
            </div>
            <div className="flex text-[24px] items-center font-[700] ml-[50px] text-[#fff] ">
              <span className="text-[16px] font-[500] text-[#B1B6C6]">
                Bet:&nbsp;
              </span>{' '}
              0.04{' '}
              <img src="/ARBMonohrome.svg" className="w-[18px]  ml-2"></img>
            </div>
          </div>
          <div className="flex justify-center items-center mt-3 text-[#fff]">
            <div className="mr-4 font-[700] text-[36px]  flex items-center gap-2">
              <img className=" w-[50px] h-[45px]" src="/JV.png" />
              12312.32{' '}
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
