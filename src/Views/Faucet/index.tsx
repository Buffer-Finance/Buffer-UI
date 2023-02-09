import { Skeleton } from '@mui/material';
import Background from './style';
import FaucetABI from './Faucet.json';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
// import { HeadTitle } from 'Views/Common/TitleHead';
import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { BlueBtn } from '@Views/Common/V2-Button';
import Drawer from '@Views/Common/V2-Drawer';
import useOpenConnectionDrawer from '@Hooks/useOpenConnectionDrawer';
import { CHAIN_CONFIG } from 'src/Config';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const IbfrFaucet: React.FC = () => {
  const props = { chain: 'ARBITRUM' } as { chain: 'ARBITRUM' };
  const { state } = useGlobal();
  const toastify = useToast();
  const [btnLoading, setBtnLoading] = useState(0);
  const { openConnectModal } = useConnectModal();
  useEffect(() => {
    document.title = 'Buffer | Faucet';
  }, []);
  const { writeCall: USDCwriteCall } = useWriteCall(
    '0x1fe5b5c9159dEf950a0483d0B33C978B55d3fbe2',
    FaucetABI
  );
  const { writeCall: BFRWriteCall } = useWriteCall(
    '0x8F4db9A46809782b67180F0f8f3d9843a5268137',
    FaucetABI
  );
  const { openWalletDrawer, shouldConnectWallet } = useOpenConnectionDrawer();
  const activeChainData = CHAIN_CONFIG[props.chain];

  const claim = (shouldCLaimUSDC = true) => {
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
    if (shouldCLaimUSDC) {
      setBtnLoading(1);
      return USDCwriteCall(cb, methodName, [], overRides);
    }
    setBtnLoading(2);
    BFRWriteCall(cb, methodName, [], overRides);
  };

  const content = activeChainData && [
    {
      top: `Claim ${import.meta.env.VITE_ENV} ${
        activeChainData?.nativeAsset.name
      }`,
      middle: (
        <>
          You will have to claim{' '}
          <span className="text-1 w500">
            {import.meta.env.VITE_ENV} {activeChainData?.nativeAsset.name}
          </span>{' '}
          for gas fee.
        </>
      ),
      bottom: (
        <div className="flex flex-col">
          <TestnetLinks chainName={props.chain} />
        </div>
      ),
    },
    {
      top: `Claim TESTNET Tokens`,
      bottom: shouldConnectWallet ? (
        <BlueBtn onClick={openConnectModal} className="btn">
          Connect Wallet
        </BlueBtn>
      ) : (
        <div className="flex items-center flex-col-m">
          <BlueBtn
            isLoading={state.txnLoading === 1 && btnLoading === 1}
            isDisabled={btnLoading === 2}
            className="btn nowrap"
            onClick={claim}
          >
            Claim 500 USDC
          </BlueBtn>
          {/* <BlueBtn
            className="btn ml20 nowrap"
            isDisabled={btnLoading === 1}
            isLoading={state.txnLoading === 1 && btnLoading === 2}
          >
            Claim 500 BFR
          </BlueBtn> */}
        </div>
      ),
    },
  ];

  return (
    <main className="content-drawer">
      {/* <HeadTitle title={'Buffer | Faucet'} /> */}
      <Background>
        <div className="wrapper">
          {activeChainData && content ? (
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

const TestnetLinks = ({ chainName }: { chainName: 'ARBITRUM' }) => {
  const activeChain = CHAIN_CONFIG[chainName];

  return (
    <div>
      {activeChain.nativeAsset.faucet.map((s, idx) => {
        if (s.options)
          return (
            <div
              key={s.url}
              className="whitespace-nowrap sm:max-w-[250px] text-ellipsis overflow-hidden"
            >
              {activeChain.nativeAsset.faucet.length === 1 ? '' : idx + 1 + '.'}
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
              {activeChain.nativeAsset.faucet.length === 1 ? '' : idx + 1 + '.'}
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
