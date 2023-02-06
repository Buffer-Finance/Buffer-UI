import React from 'react';
import { SocialStyles } from './style';
import Twitter from 'public/Social/twitter';
import Discord from 'public/Social/discord';
import Medium from 'public/Social/medium';
import Telegram from 'public/Social/telegram';
import { ConfirmationModalStyles } from './style';
import SuccessIcon from 'src/SVG/Elements/SuccessIcon';
import { IConfirmationModal } from '@Hooks/useWriteCall';
import { getDisplayDate } from '@Utils/Dates/displayDateTime';
import { divide } from '@Utils/NumString/stringArithmatics';
import { useGlobal } from '@Contexts/Global';
import { Display } from '../Tooltips/Display';
import { Skeleton } from '@mui/material';
interface IConfirmationModalProps extends IConfirmationModal {
  scannerLink: string;
  duration: string;
}
export default function ConfirmationModal({
  asset,
  expiration,
  strike,
  type,
  is_above,
  scannerLink,
  duration,
}: IConfirmationModalProps) {
  const { state } = useGlobal();
  return (
    <ConfirmationModalStyles>
      <div className="header">
        <div className="flex text">
          <SuccessIcon className="successIcon" />
          Position Opened
        </div>
        <div className="text-6 sub-text">
          Tell your friends about your buffer trading experience
        </div>
        <a
          href={scannerLink}
          target="_blank"
          rel="noreferrer"
          className="unset link hover-blue-underline"
        >
          View On {state.settings.activeChain?.displayName} Explorer
        </a>
      </div>
      <div className="main">
        <Col
          head={'Asset'}
          desc={
            <div className="flex-center">
              <img src={asset.img} alt="token" className="image-wrapper" />
              <div>{asset.name}</div>
            </div>
          }
        />
        {!duration ? (
          <Col head={'Type'} desc={type} descClass="light-blue-text" />
        ) : null}
        <Col
          head={'Strike Price'}
          desc={
            <div className="flex items-c">
              {is_above ? 'Above' : 'Below'}&nbsp;{' '}
              <Display data={divide(strike, 8)} label="$" />
            </div>
          }
          descClass={`${is_above ? 'green' : 'red'}`}
        />
        <Col
          head={duration ? 'Duration' : 'Expiration'}
          desc={duration || getDisplayDate(parseInt(expiration))}
        />
      </div>
      <div className="foot">
        <div>Share On :</div>
        <Social />
      </div>
    </ConfirmationModalStyles>
  );
}

export function Col({ head, desc, ...props }) {
  return (
    <div className={`flexc-center ${props.className || ''}`}>
      <div className={`head ${props.headClass ? props.headClass : ''}`}>
        {head ? (
          head
        ) : (
          <Skeleton className="!transform-none w-full !bg-cross-bg" />
        )}
      </div>
      <div
        className={`desc w-full text-center ${
          props.descClass ? props.descClass : ''
        }`}
      >
        {desc ? (
          desc
        ) : (
          <Skeleton className="!transform-none w-full !bg-cross-bg" />
        )}
      </div>
    </div>
  );
}
const referalText = 'Bought an option from Buffer platform. Check it out';

const social = [
  // {
  //   img: <Gitbook />,
  //   link: "https://docs.buffer.finance/",
  //   name: "GitBook",
  // },
  {
    img: <Twitter />,
    link: `https://twitter.com/share?hashtags=PredictOnBuffer&text=${referalText}&url=https://sandbox.buffer.finance/BSC/binary/WBNB`,
    name: 'Twitter',
  },
  {
    img: <Discord />,
    link: `https://telegram.me/share/url=https://sandbox.buffer.finance/BSC/binary/WBNB`,
    name: 'Discord',
  },
  {
    img: <Telegram />,
    link: 'https://t.me/bufferfinance',
    name: 'Telegram',
  },
  {
    img: <Medium />,
    link: 'https://buffer-finance.medium.com/',
    name: 'Medium',
  },
  // {
  //   img: <GitHub />,
  //   link: "https://github.com/Buffer-Finance",
  //   name: "GitHub",
  // },
];
function Social() {
  return (
    <SocialStyles className="flex items-center">
      <div className="flex items-center footer">
        {social.map((s, index) => (
          <a
            className="flex items-center content-center mar socialTip"
            key={index}
            href={s.link}
            target="_blank"
          >
            <div className=" icon flex items-center content-center">
              {s.img}
            </div>
            <div className="socialTipText light-blue-text">{s.name}</div>
          </a>
        ))}
      </div>
    </SocialStyles>
  );
}
