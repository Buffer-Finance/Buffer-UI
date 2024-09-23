import { useEffect, useRef, useState } from 'react';
import SlotCounter from 'react-slot-counter';
import { BufferLogoComponent } from './Navbar/BufferLogo';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { cn } from '@Utils/cn';
import { Link } from 'react-router-dom';
import { useUserbfrPoints } from '@Views/BFRfarmingLeaderboard/BFRfarmingLeaderboard';

const BFRCounter: React.FC<any> = ({}) => {
  const [val, setVal] = useState(0);
  const [shake, setShake] = useState(false);
  const ref = useRef();
  const bfrPoints = useUserbfrPoints();
  console.log(`BFRCounter-bfrPoints: `, bfrPoints);
  const increment = () => {
    setVal((v) => v + 100);

    // setTimeout(() => {
    // setVal((v) => v + 89);

    // }, 300);
    // setTimeout(()=>{setVal(v=>v+50)},1000)
  };
  useEffect(() => {
    if (bfrPoints) {
      setVal(bfrPoints.amount);
    } else {
      // setVal(0);
    }
  }, [bfrPoints]);

  // 900 - 1000
  // 900 - 2000
  // 900 - 3000

  // useEffect(() => {
  //   setShake(true);
  //   setTimeout(() => {
  //     setShake(false);
  //   }, 1000);
  //   setTimeout(() => {
  //     setVal((val) => val + 100);
  //   }, 6000);
  // }, [val]);

  // const divk = val / 1000 != Math.floor(val / 1000) && Math.floor(val / 1000);
  return (
    <Link to={'/bfr'}>
      <div
        className={cn(
          'flex gap-2  chip-styles-BFR-counter transition-all text-[#d4d5df]  hover:brightness-110 w-fit px-3 sm:px-2 ',
          shake ? 'shake' : ''
        )}
        title="BFR Points - Click to learn more"
      >
        {val ? (
          <>
            {' '}
            <BufferLogoComponent
              className="h-[30px]sm:h-[25px] sm:mx-[0px] circle-image  hover:scale-110 transition-all"
              hideText
              logoHeight={20}
              logoWidth={20}
              onClick={increment}
            />{' '}
            <div className="align-middle  text-f16 font-bold  ">
              {/* <span style={{ marginTop: 0, verticalAlign: 'middle' }}>
            {divk || ''}
          </span> */}
              <SlotCounter
                duration={2}
                speed={1}
                delay={0.2}
                animateUnchanged
                value={val}
                // charClassName=" cool-"
                // speed={3}
                direction="top-down"
                useMonospaceWidth
                // charClassName="bg-2 rounded-sm "
                hasInfiniteList={true}

                // sequentialAnimationMode
              />
            </div>
          </>
        ) : (
          <span className="cool-text text-f16 pb-2 font-bold ">Farm BFR</span>
        )}
        {/* <span className="align-middle cool-text">BFR </span> */}
      </div>
    </Link>
  );
};

export { BFRCounter };
