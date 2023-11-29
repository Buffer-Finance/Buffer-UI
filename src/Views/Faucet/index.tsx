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
import FaucetABI from './Faucet.json';
import Background from './style';
import { encodeFunctionData } from 'viem';
import { erc20ABI, useBalance } from 'wagmi';
import { useSmartAccount } from '@Hooks/AA/useSmartAccount';
import { PaymasterMode } from '@biconomy/paymaster';

const IbfrFaucet: React.FC = () => {
  useEffect(() => {
    document.title = 'Buffer | Faucet';
  }, []);
  const activeChain = useAtomValue(activeChainAtom);
  const { smartAccount } = useSmartAccount();
  const smartWalletAddress = smartAccount?.address;
  // const { poolDisplayNameMapping } = usePoolDisplayNames();
  const tokenChains = ['USDC'];
  // useMemo(() => {
  //   return Object.keys(poolDisplayNameMapping).filter(
  //     (token) => !token.includes('-POL') && token !== 'BFR'
  //   );
  // }, [poolDisplayNameMapping]);
  const { data: usdcBalance } = useBalance({
    address: smartWalletAddress,
    token: '0xda11d2c3b026561cce889ff5a020eae21308058c',
    watch: true,
  });
  const { data: aethBalance } = useBalance({
    address: smartWalletAddress,
    watch: true,
  });
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
      top: `Fund your Smart Wallet`,
      bottom: (
        <ConnectionRequired>
          <div className="flex items-center justify-center gap-3 text-2 flex-wrap">
            Transfer <b className="text-1">0.001</b> AETH to you Smart Wallet{' '}
            <b className="text-1">{smartWalletAddress}</b>
          </div>
          <div className="flex items-center justify-center gap-3 text-1 flex-wrap">
            Smart Wallet AETH Balance : {aethBalance?.formatted} AETH
          </div>
        </ConnectionRequired>
      ),
    },
    {
      top: `Claim TESTNET Tokens`,
      bottom: (
        <ConnectionRequired>
          <div className="flex items-center justify-center gap-3 text-1 flex-wrap">
            Smart Wallet USDC Balance : {usdcBalance?.formatted} USDC
          </div>
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

const ClaimButton = ({ token }: { token: string }) => {
  const { state } = useGlobal();
  const [btnLoading, setBtnLoading] = useState(0);
  // const pools = usePoolByAsset();
  const faucetContract = '0x6442f44b940aAD814A8e75C915f8997e94F191aE';
  //  pools[token]?.faucet;
  const { smartAccount } = useSmartAccount();
  const smartWallet = smartAccount?.library;
  const smartWalletAddress = smartAccount?.address;

  const { writeCall } = useWriteCall();
  const toastify = useToast();

  const claim = async () => {
    // claim from main account
    // transfer to sw
    if (!smartWalletAddress) return;
    const claimTxn = {
      to: faucetContract,
      data: encodeFunctionData({
        abi: FaucetABI,
        functionName: 'claim',
      }),
      value: ethers.utils.parseEther('0.001'),
    };
    // const fundSWTxn = {
    //   to: '0xda11d2c3b026561cce889ff5a020eae21308058c',
    //   data: encodeFunctionData({
    //     abi: erc20ABI,
    //     functionName: 'transfer',
    //     args: [smartWalletAddress, 1000000n],
    //   }),
    // };
    console.log(`index-smartWalletAddress: `, smartWalletAddress);

    const userOps = await smartWallet?.buildUserOp([claimTxn], {
      paymasterServiceData: {
        mode: PaymasterMode.SPONSORED,
      },
    });
    if (!userOps) return;
    const userOpResponse = await smartWallet?.sendUserOp(userOps);
    const reciept = await userOpResponse?.wait(1);
    console.log(`index-reciept: `, reciept);
    setBtnLoading(0);
  };

  return (
    <BlueBtn
      isLoading={state.txnLoading === 1 && btnLoading === 1}
      isDisabled={state.txnLoading === 1}
      className="btn nowrap mt-1"
      onClick={claim}
    >
      Claim 500 USDC
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
