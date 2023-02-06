import React, { useState } from "react";
import { PrimaryActionBtn, SecondaryActionBtn } from "../Buttons";
import { Background } from "./style";

export default function Banner() {
  const [isOpen, setIsOpen] = useState(true);
  const lastBannerTime = localStorage.getItem("bannerTime");

  function setTimeStamp() {
    localStorage.setItem("bannerTime", Date.now().toString());
    setIsOpen(false);
  }
  if (
    !lastBannerTime ||
    (Date.now() - parseInt(lastBannerTime) >= 1209600000 && isOpen) //will render every 86400000ms = 24 hrs
  )
    return (
      <Background>
        <div className="layer"></div>
        <div className="modal flex-col">
          <p className="head">
            By using Buffer Finance dApp, I agree to the following Important
            Disclaimer
          </p>
          <div className="desc flex-col">
            <p className="desc">
              I am lawfully permitted to access this site and use the Buffer
              dApp under the laws of the jurisdiction where I reside and am
              located.
            </p>
            <p className="desc">
              I will not use the Buffer dApp while located within any Prohibited
              Jurisdictions.
            </p>
            {/* <p className="desc">
              Buffer dApp (V2) is in Mainnet Beta with trusted admin controls. I
              understand the risks associated with using Buffer dApp.
            </p> */}
          </div>
          <SecondaryActionBtn className="btn font1" onClick={setTimeStamp}>
            Agree and continue
          </SecondaryActionBtn>
        </div>
      </Background>
    );
  else return <></>;
}
