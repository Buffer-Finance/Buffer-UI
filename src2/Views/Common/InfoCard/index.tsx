import { useState, useEffect, ReactNode } from "react";
import Background from "./style";

interface IInfoCard {
  info: {
    head: string | ReactNode;
    desc: string | ReactNode;
  };
}

const InfoCard: React.FC<IInfoCard> = ({ info }) => {
  return (
    <Background>
      <span className="headd">{info.head}</span>
      <span className="val">{info.desc}</span>
    </Background>
  );
};

export default InfoCard;
