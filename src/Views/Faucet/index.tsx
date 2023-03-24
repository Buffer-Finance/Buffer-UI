import { Skeleton } from '@mui/material';
import Background from './style';
import FaucetABI from './Faucet.json';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { BlueBtn } from '@Views/Common/V2-Button';
import Drawer from '@Views/Common/V2-Drawer';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';

const IbfrFaucet: React.FC = () => {
  useEffect(() => {
    document.title = 'Buffer | Faucet';
  }, []);
  const { activeChain } = useActiveChain();
  const tokenChains = {
    '421613': ['USDC', 'ARB'],
    '80001': ['USDC'],
  };

  const content = activeChain && [
    {
      top: `Claim ${import.meta.env.VITE_ENV} ${
        activeChain.nativeCurrency.symbol
      }`,
      middle: (
        <>
          You will have to claim{' '}
          <span className="text-1 w500">
            {import.meta.env.VITE_ENV} {activeChain.nativeCurrency.symbol}
          </span>{' '}
          for gas fee.
        </>
      ),
      bottom: (
        <div className="flex flex-col">
          <TestnetLinks />
        </div>
      ),
    },
    {
      top: `Claim TESTNET Tokens`,
      bottom: (
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {tokenChains[activeChain.id].map((token: string) => (
            <ClaimButton token={token} />
          ))}
        </div>
      ),
    },
  ];

  return (
    <main className="content-drawer">
      <Background>
        <div className="wrapper">
          {activeChain && content ? (
            content.map((s) => (
              <div className="faucet-card bg-1">
                <div className="card-head">{s.top}</div>
                {s.middle && <div className="card-middle">{s.middle}</div>}
                <div className="card-action">{s.bottom}</div>
              </div>
            ))
          ) : (
            <Skeleton className="custom-loader lc sr" variant="rectangular" />
          )}
        </div>
      </Background>
      <Drawer open={false}>
        <></>
      </Drawer>
    </main>
  );
};

const ClaimButton = ({ token }: { token: string }) => {
  const { state } = useGlobal();
  const [btnLoading, setBtnLoading] = useState(0);
  const { configContracts } = useActiveChain();
  const { writeCall } = useWriteCall(
    configContracts.tokens[token].faucet,
    FaucetABI
  );
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
      value: ethers.utils.parseEther('0.001'),
    };
    const methodName = 'claim';
    setBtnLoading(1);
    return writeCall(cb, methodName, [], overRides);
  };

  return (
    <ConnectionRequired>
      <BlueBtn
        isLoading={state.txnLoading === 1 && btnLoading === 1}
        isDisabled={state.txnLoading === 1}
        className="btn nowrap"
        onClick={claim}
      >
        Claim 500 {token}
      </BlueBtn>
    </ConnectionRequired>
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
  console.log(`activeChain: `, activeChain);
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
                      <div>
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
