import { useEffect, useRef, useState } from 'react';
import SlotCounter from 'react-slot-counter';
import { BufferLogoComponent } from './Navbar/BufferLogo';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { cn } from '@Utils/cn';

const BFRCounter: React.FC<any> = ({}) => {
  const [val, setVal] = useState(100);
  const [shake, setShake] = useState(false);
  const ref = useRef();
  const increment = () => {
    setVal((v) => v + 100);

    // setTimeout(() => {
    // setVal((v) => v + 89);

    // }, 300);
    // setTimeout(()=>{setVal(v=>v+50)},1000)
  };

  // 900 - 1000
  // 900 - 2000
  // 900 - 3000
  useEffect(() => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 1000);
    setTimeout(() => {
      setVal((val) => val + 100);
    }, 6000);
  }, [val]);

  const divk = val / 1000 != Math.floor(val / 1000) && Math.floor(val / 1000);
  return (
    <>
      <div
        className={cn(
          'flex gap-2 chip-styles-BFR-counter transition-all text-[#d4d5df]  hover:brightness-110 w-fit px-3 ',
          shake ? 'shake' : ''
        )}
      >
        <BufferLogoComponent
          className="h-[30px] sm:mx-[0px] circle-image  hover:scale-110 transition-all"
          hideText
          logoHeight={20}
          logoWidth={20}
          onClick={increment}
        />{' '}
        <div className="align-middle text-f16 font-bold">
          <span style={{ marginTop: 0, verticalAlign: 'middle' }}>
            {divk || ''}
          </span>
          <SlotCounter
            duration={2}
            speed={1}
            delay={0.2}
            animateUnchanged
            value={val % 1000 ? val % 1000 : val}
            // speed={3}
            direction="top-down"
            useMonospaceWidth
            // charClassName="bg-2 rounded-sm "
            hasInfiniteList={true}

            // sequentialAnimationMode
          />
        </div>
      </div>
    </>
  );
};

export { BFRCounter };
