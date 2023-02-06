import { useState, useEffect, ReactNode } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import Background from "./style";
interface ITabSwitch {
  value: number;
  childComponents?: ReactNode[];
  className?: string;
}

const TabSwitch: React.FC<ITabSwitch> = ({
  value,
  childComponents,
  children,
  className,
}) => {
  return (
    <Background>
      <SwitchTransition>
        <CSSTransition key={value} classNames={"tab-pannel-"} timeout={200}>
          <div className={`tab-pannel ${className}`}>
            {childComponents[value]}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </Background>
  );
};

export default TabSwitch;
