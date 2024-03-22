import { ReactNode } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Background from './style';
interface ITabSwitch {
  value: number;
  childComponents?: ReactNode[];
  className?: string;
}

const TabSwitch: React.FC<ITabSwitch> = ({
  value,
  childComponents,
  className = '',
}) => {
  return (
    <Background>
      <SwitchTransition>
        <CSSTransition key={value} classNames={'tab-pannel-'} timeout={200}>
          <div className={`tab-pannel ${className}`}>
            {childComponents && childComponents[value]}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Background>
  );
};

export default TabSwitch;
