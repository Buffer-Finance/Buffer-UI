import { Display } from '@Views/Common/Tooltips/Display';
import { useEffect, useState } from 'react';
const initD = ['800123.32', '22313.2312', '312312.11', '32131123.231'];
const Decd = ['800123.31', '22313.2311', '312312.10', '32131123.230'];

import {
  ConnectButton,
  useAccountModal,
  useChainModal,
  useConnectModal,
} from '@rainbow-me/rainbowkit';
import { useNetwork } from 'wagmi';
import { useLocation } from 'react-router-dom';

const Test: React.FC<any> = ({}) => {
  const history = useLocation();
  const { chain } = useNetwork();
  useEffect(() => {
    console.log(`history: `, window.location.href);
  }, [chain]);

  return <div>I am the test page</div>;
};

export { Test };
