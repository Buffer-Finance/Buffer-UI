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

const Test: React.FC<any> = ({}) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { openChainModal } = useChainModal();
  const {chain} = useNetwork();
  useEffect(()=>{
    console.log(`chain-c${chain}`);
  },[chain])
  
  return (
    <div>
      <button onClick={openConnectModal}>openConnectModal</button>
      <button onClick={openAccountModal}>openAccountModal</button>
      <button onClick={openChainModal}>openChainModal</button>
    </div>
  );
};

export { Test };
