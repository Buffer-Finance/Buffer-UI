import { useState, useEffect, ReactNode } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import Background from "./style";
interface IVeticalTransition {
  value: number;
  className?: string;
  children: ReactNode;
}

const VerticalTransition: React.FC<IVeticalTransition> = ({
  value,
  children,
  className,
}) => {
  return (
    <Background className={`tab-pannel ${value ? "in" : "out"} ${className}`}>
      {children[value]}
    </Background>
  );
};

export default VerticalTransition;
