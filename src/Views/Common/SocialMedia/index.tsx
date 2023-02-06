import React from "react";
import Style from "./style";
import Link from "react-router";
import MobileFooter from "./MobileFooter";
import { useGlobal } from "@Contexts/Global";
import Peckshield from "src/SVG/PeckShield";
export const social = [
  {
    name: "Twitter",
    image: "Twitter.svg",
    link: "https://twitter.com/Buffer_Finance",
  },
  {
    name: "Telegram",
    image: "Telegram.svg",
    link: "https://t.me/bufferfinance",
  },
  {
    name: "Discord",
    image: "Discord.svg",
    link: "https://discord.com/invite/Hj4QF92Kdc",
  },
];
const SocialMedia = ({}) => {
  const { state, dispatch } = useGlobal();

  return (
    <Style
      className={`${
        state.sidebar_active ? null : "sidebar-closed"
      } flex content-sbw items-center `}
      id="footer"
    >
      <div className="social flex items-center">
        {social.map((social_link) => {
          return (
            <Link href={social_link.link} key={social_link.name}>
              <a
                className="social_link pointer flex items-center"
                target={"_blank"}
              >
                <img
                  key={social_link.name}
                  src={`/Social/${social_link.image}`}
                  className="social_link_icon"
                />
              </a>
            </Link>
          );
        })}
      </div>

      <div className="badge">
        <a
          target={"_blank"}
          href="https://github.com/peckshield/publications/blob/master/audit_reports/PeckShield-Audit-Report-Buffer-v1.0.pdf"
        >
          <Peckshield />
        </a>
      </div>
      <MobileFooter />
    </Style>
  );
};

export default SocialMedia;
