import { ReactNode } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import Background from './style';
interface IHorizonatlTransition {
  value: number;
  className?: string;
  children: ReactNode[];
}

const HorizontalTransition: React.FC<IHorizonatlTransition> = ({
  value,
  children,
  className,
}) => {
  return (
    <Background>
      <SwitchTransition>
        <CSSTransition key={value} classNames={'tab-pannel-'} timeout={100}>
          <div className={`tab-pannel ${className}`}>{children[value]}</div>
        </CSSTransition>
      </SwitchTransition>
    </Background>
  );
};

export default HorizontalTransition;
