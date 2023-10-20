import { Skeleton } from '@mui/material';
import Background from './style';
import FaucetABI from './Faucet.json';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { BlueBtn } from '@Views/Common/V2-Button';
import Drawer from '@Views/Common/V2-Drawer';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { usePoolByAsset } from '@Views/TradePage/Hooks/usePoolByAsset';
import { usePoolDisplayNames } from '@Views/DashboardV2/hooks/usePoolDisplayNames';
import { sleep } from '@TV/useDataFeed';
let i = 1;
const IbfrFaucet: React.FC = () => {
  const [c, setc] = useState(0);
  const inc = async () => {
    setc(c + 1);
    setInterval(() => {
      i++;
      setc(i);
    }, 1);
  };
  return (
    <main className="content-drawer">
      <button onClick={inc}>{c}</button>
    </main>
  );
};

const ClaimButton = ({ token }: { token: string }) => {
  const { state } = useGlobal();
  const [btnLoading, setBtnLoading] = useState(0);
  const pools = usePoolByAsset();
  const faucetContract = pools[token]?.faucet;

  const { writeCall } = useWriteCall(faucetContract, FaucetABI);
  const toastify = useToast();

  const claim = () => {
    if (state.txnLoading > 1) {
      return toastify({
        type: 'error',
        msg: 'Please Confirm your pending txns.',
      });
    }
    function cb(res: any) {
      setBtnLoading(0);
    }
    const overRides = {
      value: ethers.utils.parseEther('0.001').toString(),
    };
    const methodName = 'claim';
    setBtnLoading(1);
    return writeCall(cb, methodName, [], overRides);
  };

  return (
    <BlueBtn
      isLoading={state.txnLoading === 1 && btnLoading === 1}
      isDisabled={state.txnLoading === 1}
      className="btn nowrap"
      onClick={claim}
    >
      Claim 500 {token}
    </BlueBtn>
  );
};

const faucetClaimingSteps = {
  421613: {
    name: 'AETH',
    symbol: 'AETH',
    faucet: [
      {
        step: 'Claim goerliETH from goerli faucet',
        url: 'https://goerlifaucet.com/',
        options: [
          {
            step: 'Using the Goerli faucet',
            url: 'https://goerlifaucet.com/',
          },
          {
            step: 'Using the Goerli Mudit faucet',
            url: 'https://goerli-faucet.mudit.blog/',
          },
          {
            step: 'Using the Paradigm Multifaucet',
            url: 'https://faucet.paradigm.xyz/',
          },
        ],
      },
      {
        step: 'Bridge GoerliETH to AETH',
        url: 'https://bridge.arbitrum.io/?l2ChainId=421613',
      },
    ],
    img: '/Chains/ARBITRIUM.png',
    decimals: 18,
    category: 'Crypto',
  },
  80001: {
    name: 'MATIC',
    symbol: 'MATIC',
    faucet: [
      {
        step: 'Claim testnet MATIC',
        url: 'https://mumbaifaucet.com/',
      },
    ],
  },
};

const TestnetLinks = () => {
  const { activeChain } = useActiveChain();
  return (
    <div>
      {faucetClaimingSteps[activeChain.id].faucet.map((s, idx) => {
        if (s.options)
          return (
            <div
              key={s.url}
              className="whitespace-nowrap sm:max-w-[250px] text-ellipsis overflow-hidden"
            >
              {faucetClaimingSteps[activeChain.id].faucet.length === 1
                ? ''
                : idx + 1 + '.'}
              <span className="w-full">
                {s.step}
                {s.options && (
                  <div className="ml-7">
                    {s.options.map((option, index) => (
                      <div key={option.url}>
                        {index + 1 + '.'}
                        <a href={option.url} target="_blank">
                          {option.step}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </span>
            </div>
          );
        else
          return (
            <div
              key={s.url}
              className="whitespace-nowrap sm:max-w-[250px] text-ellipsis overflow-hidden"
            >
              {faucetClaimingSteps[activeChain.id].faucet.length === 1
                ? ''
                : idx + 1 + '.'}
              <span className="w-full">
                <a href={s.url || s} target="_blank">
                  {s.step || s}
                </a>
              </span>
            </div>
          );
      })}
    </div>
  );
};
export default IbfrFaucet;
