import styled from '@emotion/styled';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import EarnIcon from 'src/SVG/Elements/EarnIcon';
import FrontArrow from 'src/SVG/frontArrow';
import Drawer from '@Views/Common/V2-Drawer';
import { Chain } from 'wagmi';
import { getEarnCards } from './Components/EarnCards';
import { Section } from './Components/Section';
// import { getVestCards } from './Components/VestCards';
import { IEarn, writeEarnData } from './earnAtom';
import { useGetTokenomics } from './Hooks/useTokenomicsMulticall';
import { EarnModals } from './Modals';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ArbitrumOnly, ExceptArbitrum } from '@Views/Common/ChainNotSupported';

const EarnStyles = styled.div`
  width: min(1200px, 100%);
  margin: auto;
  padding-bottom: 24px;
  /* white-space: nowrap; */
`;

const topStyles = 'flex flex-row items-center justify-center mb-2 text-f22';
const descStyles = 'w-[46rem] text-center m-auto tab:w-full';

export const EarnContext = React.createContext<{ activeChain: Chain } | null>(
  null
);
const EarnContextProvider = EarnContext.Provider;
export const Earn = () => {
  const { activeChain } = useActiveChain();
  useEffect(() => {
    document.title = 'Buffer | Earn';
  }, []);
  return (
    <ExceptArbitrum>
      <EarnContextProvider value={{ activeChain }}>
        <main className="content-drawer">
          <EarnPage />
        </main>
        <Drawer open={false}>
          <></>
        </Drawer>
      </EarnContextProvider>
    </ExceptArbitrum>
  );
};

export const EarnPage = () => {
  const [, setEarnData] = useAtom(writeEarnData);
  const data: IEarn = useGetTokenomics();

  setEarnData(data);

  return (
    <EarnStyles>
      <EarnModals />
      <Section
        Heading={
          <div className={topStyles}>
            <EarnIcon className="mr-3" />
            Earn
          </div>
        }
        Cards={getEarnCards(data)}
        subHeading={
          <div className={descStyles}>
            Stake BFR and BLP to earn rewards.
            {/* <span
              className="light-blue-text  whitespace-nowrap ml6  hover:underline  cursor-pointer"
              onClick={() => {
                window.open(
                  'https://buffer-finance.medium.com/introducing-all-new-bfr-staking-and-liqudity-pool-ba4b888ba470',
                  '_blank'
                );
              }}
            >
              <span className="whitespace-nowrap">
                Learn more
                <FrontArrow className="tml w-fit inline" />
              </span>
            </span> */}
          </div>
        }
      />
      {/* <Section
        Heading={
          <div className={topStyles}>
            <img src="/Earn/Shield.svg" alt="shield" className="mr-3" />
            Vest
          </div>
        }
        Cards={getVestCards(data)}
        subHeading={
          <div className={descStyles}>
            Convert esBFR tokens to BFR tokens.
            <span
              className="light-blue-text ml6 whitespace-nowrap  hover:underline  cursor-pointer"
              onClick={() => {
                window.open(
                  'https://buffer-finance.medium.com/introducing-all-new-bfr-staking-and-liqudity-pool-ba4b888ba470',
                  '_blank'
                );
              }}
            >
              <span className="whitespace-nowrap">
                Learn more
                <FrontArrow className="tml w-fit inline" />
              </span>
            </span>
          </div>
        }
      /> */}
      {
        <div className="pr-3 text-3 text-f13 m-auto w-full text-center mt-6">
          &#127860; Staking is forked from{' '}
          <a
            href="https://app.gmx.io/#/earn"
            target={'_blank'}
            className="hover:text-1 underline underline-offset-2"
          >
            GMX
          </a>
        </div>
      }
    </EarnStyles>
  );
};
