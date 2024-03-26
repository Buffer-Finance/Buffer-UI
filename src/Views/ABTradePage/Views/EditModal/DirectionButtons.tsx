import { RowGap } from '@Views/ABTradePage/Components/Row';
import { WhiteDownArrow } from '@Views/ABTradePage/Components/WhiteArrow';
import { directionBtn } from '@Views/ABTradePage/type';
import styled from '@emotion/styled';

export const DirectionButtons: React.FC<{
  activeBtn: number;
  setActiveBtn: (btnNumber: number) => void;
}> = ({ activeBtn, setActiveBtn }) => {
  const isUp = activeBtn === directionBtn.Up;
  return (
    <DirectionButtonBackground gap="6px">
      <button
        className={`directionbtn greenbtn ${isUp ? 'greenactive' : ''}`}
        onClick={() => setActiveBtn(directionBtn.Up)}
      >
        <WhiteDownArrow className={` scale-110 rotate-180`} />
        Up
      </button>
      <button
        className={`directionbtn redbtn ${!isUp ? 'redactive' : ''}
      `}
        onClick={() => setActiveBtn(directionBtn.Down)}
      >
        <WhiteDownArrow className="scale-125" /> Down
      </button>
    </DirectionButtonBackground>
  );
};

const DirectionButtonBackground = styled(RowGap)`
  color: rgba(255, 255, 255, 0.6);
  margin-top: 8px;
  font-weight: 500;
  font-size: 14px;

  .directionbtn {
    width: 100%;
    background-color: #282b39;
    height: 28px;
    border-radius: 5px;
    transition: all 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .greenbtn {
    :hover {
      color: #ffffff;
      background-color: #3fb68b;
    }
    .active {
      color: #ffffff;
      background-color: #3fb68b;
    }
  }
  .redbtn {
    :hover {
      color: #ffffff;
      background-color: #e53e3e;
    }
  }

  .redactive {
    color: #ffffff;
    background-color: #e53e3e;
  }

  .greenactive {
    color: #ffffff;
    background-color: #3fb68b;
  }
`;
