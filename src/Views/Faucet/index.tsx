import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
import Drawer from '@Views/Common/V2-Drawer';
import { activeChainAtom } from '@Views/NoLoss-V3/atoms';
import { Skeleton } from '@mui/material';
import { ethers } from 'ethers';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Chain } from 'wagmi';
import FaucetABI from './Faucet.json';
import Background from './style';

const IbfrFaucet: React.FC = () => {
  useEffect(() => {
    document.title = 'Buffer | Faucet';
  }, []);
  const activeChain = useAtomValue(activeChainAtom);

  // const { poolDisplayNameMapping } = usePoolDisplayNames();
  const tokenChains = ['USDC'];
  // useMemo(() => {
  //   return Object.keys(poolDisplayNameMapping).filter(
  //     (token) => !token.includes('-POL') && token !== 'BFR'
  //   );
  // }, [poolDisplayNameMapping]);

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
        <ConnectionRequired>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {tokenChains.map((token: string) => (
              <ClaimButton token={token} key={token} />
            ))}
          </div>{' '}
        </ConnectionRequired>
      ),
    },
  ];

  return (
    <main className="content-drawer">
      <Background>
        <div className="wrapper">
          {activeChain && content ? (
            content.map((s, i) => (
              <div className="faucet-card bg-1" key={i}>
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

const ClaimButton = ({
  token,
  activeChain,
}: {
  token: string;
  activeChain: Chain;
}) => {
  const { state } = useGlobal();
  const [btnLoading, setBtnLoading] = useState(0);
  // const pools = usePoolByAsset();
  const faucetContract =
    activeChain.id == 168587773
      ? '0x98ecb38A7dBf2518C24F3Dd793284a24d2B39629'
      : '0x6442f44b940aAD814A8e75C915f8997e94F191aE';
  //  pools[token]?.faucet;

  const { writeCall } = useWriteCall();
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
    return writeCall(faucetContract, FaucetABI, cb, methodName, [], overRides);
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
  168587773: {
    name: 'AETH',
    symbol: 'AETH',
    faucet: [
      {
        step: 'Claim AETH from sepolia faucet',
        url: 'https://sepoliafaucet.com/',
      },
      {
        step: 'Send SepoliaETH to 0xDeDa8D3CCf044fE2A16217846B6e1f1cfD8e122f.',
        // url: 'https://bridge.arbitrum.io/?l2ChainId=421613',
      },
      {
        step: 'Directly claim AETH from here',
        url: 'https://faucet.quicknode.com/blast/sepolia',
      },
    ],
  },
  421614: {
    name: 'AETH',
    symbol: 'AETH',
    faucet: [
      {
        step: 'Claim AETH from sepolia faucet',
        url: 'https://sepoliafaucet.com/',
        // options: [
        //   {
        //     step: 'Using the Goerli faucet',
        //     url: 'https://goerlifaucet.com/',
        //   },
        //   {
        //     step: 'Using the Paradigm Multifaucet',
        //     url: 'https://faucet.paradigm.xyz/',
        //   },
        // ],
      },
      {
        step: 'Bridge SepoliaETH to AETH',
        url: 'https://bridge.arbitrum.io/?l2ChainId=421613',
      },
      {
        step: 'Directly claim AETH from here',
        url: 'https://bwarelabs.com/faucets/arbitrum-sepolia',
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
  const activeChain = useAtomValue(activeChainAtom);
  if (activeChain === undefined) return <></>;
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
