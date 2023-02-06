import { useState, useEffect, ReactNode } from "react";
import Background from "./style";

interface IDisclaimer {
  children: ReactNode;
  show: boolean;
  className?: string;
}

const Disclaimer: React.FC<IDisclaimer> = ({ children, show, className }) => {
  return (
    <>{show && <Background className={className}>{children}</Background>} </>
  );
};

export default Disclaimer;
