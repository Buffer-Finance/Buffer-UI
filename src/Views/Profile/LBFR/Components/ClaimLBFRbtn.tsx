import { useGlobal } from '@Contexts/Global';
import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { useState } from 'react';
import { getContract } from '../Config/Addresses';
import { useLBFRGraphql } from '../Hooks/useGraphql';
import styled from '@emotion/styled';
import { divide, lte } from '@Utils/NumString/stringArithmatics';
import axios from 'axios';
import { BlueBtn } from '@Views/Common/V2-Button';
import { btnClasses } from '@Views/Earn/Components/EarnButtons';
import { getBalance } from '@Views/Common/AccountInfo';
import LBFRabi from '../Config/FaucetLBFR.json';

export const ClaimLBFRBtn = ({
  shouldShowValue = false,
  shouldShowIcon = false,
  shouldNotShowForZero = false,
  className = '',
}: {
  shouldShowValue?: boolean;
  shouldShowIcon?: boolean;
  shouldNotShowForZero?: boolean;
  className?: string;
}) => {
  const { address: account } = useUserAccount();
  const toastify = useToast();
  const { state } = useGlobal();
  const [btnState, setBtnState] = useState(false);
  const { viewOnlyMode } = useUserAccount();
  const { activeChain } = useActiveChain();
  const { writeCall } = useWriteCall(
    getContract(activeChain.id, 'LBFRfaucet'),
    LBFRabi
  );
  const data = useLBFRGraphql();
  const decimals = 18;

  const SVGclasses = styled.div`
    &:hover {
      svg {
        path {
          fill: url(#paint0_linear_2224_8373);
        }
        circle {
          fill: white;
        }
      }
    }
  `;
  async function claim() {
    if (
      data &&
      data.totalVolume &&
      data.totalVolume[0] &&
      lte(data.totalVolume[0].claimable, '0')
    )
      return toastify({
        type: 'error',
        msg: `You have no LBFR to claim`,
        id: 'claimLBFR',
      });

    setBtnState(true);
    try {
      const res = await axios.get(
        `https://lbfr.buffer-finance-api.link/lbfr/claim/${import.meta.env.VITE_ENV.toLowerCase()}/${account}`
      );
      console.log(res, 'res');
      if (res.data.error) {
        setBtnState(false);
        return;
      }
      const {
        signed_hash,
        current_week_token_allocation,
        former_week_token_allocation,
        weekID,
      } = res.data;

      writeCall(() => setBtnState(false), 'claim', [
        signed_hash,
        current_week_token_allocation,
        former_week_token_allocation,
        weekID,
      ]);
    } catch (e) {
      toastify({
        type: 'error',
        msg: `Failed to fetch data. Please try again. ${e}`,
        id: 'claimLBFR',
      });
      setBtnState(false);
    }
  }
  if (account === undefined) return <></>;
  if (data === undefined)
    return (
      <BlueBtn
        onClick={() => {
          console.log(data, 'claimLBFRbtnError');
        }}
        isDisabled
        className={className}
      >
        Claim LBFR
      </BlueBtn>
    );
  if (
    shouldNotShowForZero &&
    data &&
    data.totalVolume &&
    data.totalVolume[0] &&
    lte(data.totalVolume[0].claimable, '0')
  )
    return <></>;
  return (
    <SVGclasses>
      <BlueBtn
        onClick={claim}
        className={btnClasses + ' ' + className}
        isDisabled={viewOnlyMode || state.txnLoading >= 1}
        isLoading={btnState}
      >
        {shouldShowIcon && (
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <circle
              cx="8.24892"
              cy="8.24892"
              r="8.24892"
              fill="url(#paint0_linear_2224_8364)"
            />
            <path
              d="M8.45926 3.35996C8.37015 3.24906 8.28104 3.13816 8.17169 3C8.12449 3.07449 8.0937 3.12307 8.06677 3.17049L8.06071 3.18006C6.67774 5.36237 5.29616 7.54248 3.91093 9.72344C3.8469 9.82448 3.83738 9.90361 3.89549 10.0141C4.28022 10.7534 4.65991 11.4957 5.03455 12.241C5.0944 12.3586 5.16099 12.4015 5.296 12.4005C7.34704 12.4041 9.39982 12.4149 11.4512 12.4278C11.5693 12.4289 11.635 12.3894 11.6962 12.2927C12.0606 11.708 12.4286 11.1223 12.8056 10.5421C12.8816 10.4271 12.8715 10.3544 12.7791 10.2536C11.6231 10.1494 7.85917 9.95374 6.72321 9.85248L6.85544 9.64382C7.79919 8.1546 8.74433 6.66319 9.6926 5.17669C9.77194 5.05149 9.76178 4.97875 9.67127 4.87005C9.26251 4.3709 8.86158 3.86433 8.45926 3.35996Z"
              fill="white"
            />
            <defs>
              <linearGradient
                id="paint0_linear_2224_8364"
                x1="16.8828"
                y1="4.33417"
                x2="-0.58973"
                y2="5.69167"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#13D6C9" />
                <stop offset="1" stop-color="#0047D0" />
              </linearGradient>
              <defs>
                <linearGradient
                  id="paint0_linear_2224_8373"
                  x1="13.0662"
                  y1="5.47681"
                  x2="3.53016"
                  y2="6.18402"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#13D6C9" />
                  <stop offset="1" stop-color="#0047D0" />
                </linearGradient>
              </defs>
            </defs>
          </svg>
        )}
        Claim{' '}
        {shouldShowValue && (
          <>
            {getBalance(
              divide(data.totalVolume?.[0]?.claimable ?? '0', decimals)
            )}{' '}
            <span className="sm:hidden ml-2">LBFR</span>
          </>
        )}
      </BlueBtn>
    </SVGclasses>
  );
};
