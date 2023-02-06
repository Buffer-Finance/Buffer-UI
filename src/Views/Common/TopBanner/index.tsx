import { useState, useEffect, useRef } from "react";
import { setTopMargin } from "@Utils/appControls/removeMargin";
import Background from "./style";

interface ITopBanner {}
const fixAppPositon = (height: number) => {
  // setTopMargin('app-wrapper', height)
};

const TopBanner: React.FC<ITopBanner> = ({}) => {
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    fixAppPositon(height);
  }, []);
  return (
    <Background ref={ref}>
      Official iBFR contract address{" "}
      <a href="/">0xa296aD1C47FE6bDC133f39555C1D1177BD51fBc5 </a>
    </Background>
  );
};

export default TopBanner;
