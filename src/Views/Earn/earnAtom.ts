import { atom } from 'jotai';
import { ReactNode } from 'react';
import { atomWithLocalStorage } from '@Views/BinaryOptions/PGDrawer';
interface IEarnAtom {
  isModalOpen: boolean;
  activeModal: string | null;
}
export const earnAtom = atom<IEarnAtom>({
  isModalOpen: false,
  activeModal: null,
});

export const writeEarnAtom = atom(null, (get, set, update: IEarnAtom) =>
  set(earnAtom, update)
);

const earnData = atom<IEarn>({ earn: null, vest: null });
export const readEarnData = atom((get) => get(earnData));
export const writeEarnData = atom(null, (get, set, update: IEarn) => {
  set(earnData, update);
});

export const compoundRewardsAtom = atomWithLocalStorage('compoundrewardsKeys', {
  shouldstakemultiplierpoints: true,
  shouldclaimiBFR: true,
  shouldstakeiBFR: true,
  shouldclaimesBFR: true,
  shouldstakeesBFR: true,
  shouldclaimeth: true,
  shouldconvertweth: true,
});
export const compoundRewardsAtom2 = atomWithLocalStorage(
  'compoundrewardsKeys2',
  {
    shouldclaimiBFR: true,
    shouldstakeiBFR: true,
    shouldclaimesBFR: true,
    shouldstakeesBFR: true,
    shouldclaimarb: true,
  }
);

export const claimRewardsAtom2 = atomWithLocalStorage('claimrewardsKeys2', {
  shouldclaimiBFR: true,
  shouldclaimesBFR: true,
  shouldclaimarb: true,
});

export const claimRewardsAtom = atomWithLocalStorage('claimrewardsKeys', {
  shouldclaimiBFR: true,
  shouldclaimesBFR: true,
  shouldclaimeth: true,
  shouldconvertweth: true,
});

export interface IClaim {
  shouldclaimiBFR: boolean;
  shouldclaimesBFR: boolean;
  shouldclaimeth: boolean;
  shouldconvertweth: boolean;
}

export interface ICompound {
  shouldstakemultiplierpoints: boolean;
  shouldclaimiBFR: boolean;
  shouldstakeiBFR: boolean;
  shouldclaimesBFR: boolean;
  shouldstakeesBFR: boolean;
  shouldclaimeth: boolean;
  shouldconvertweth: boolean;
}
interface IValue {
  value_in_usd: string;
  token_value: string;
  token_value_abs: string;
}
interface ITooltip {
  key: string;
  value: string;
}
interface IApr {
  description: string;
  tooltip: ITooltip[];
  value: string;
}

export interface IBLP {
  price: string;
  apr: IApr;
  total_staked: IValue;
  total_supply: IValue;
  max_unstakeable: string;
  multiplier_points_apr: string;
  maxLiquidity: string;
  currentLiquidity: string;
  lockupPeriod: string;
  user: {
    usd_reward: string;
    rewards: string;
    staked: IValue;
    wallet_balance: IValue;
    max_unlocked_amount: string;
    esBfr_rewards: {
      value_abs: string;
      value_in_usd: string;
    };
  };
}
export interface IiBFR extends Omit<IBLP, 'user'> {
  boost_percentage: string;
  boost_percentage_description: ReactNode;
  multiplier_points_apr: string;
  user: {
    allowance: string;
    usd_reward: string;
    rewards: string;
    staked: IValue;
    wallet_balance: IValue;
    esBfr_rewards: { value_abs: string; value_in_usd: string };
  };
}

export interface IesBfr extends Omit<IBLP, 'user'> {
  user: {
    allowance: string;
    usd_reward: string;
    rewards: string;
    staked: IValue;
    wallet_balance: IValue;
    esBfr_rewards: { value_abs: string; value_in_usd: string };
  };
}
export interface IBLPV2 extends IBLP {
  blpToUsdc: string;
  usdcToBlp: string;
}
export interface ITotalRewards {
  multiplier_points: string;
  staked_multiplier_points: string;
  total: string;
  usd: IValue;
  esBfr: IValue;
  bfr: IValue;
  arb: IValue;
  arbesBfr: IValue;
  arbbfr: IValue;
}

export interface IStakedToken {
  value: string;
  tooltip: ITooltip[];
}
export interface IVestToken {
  tokenContract: string;
  vesterContract: string;
  staked_tokens: IStakedToken;
  reserved_for_vesting: string[];
  vesting_status: { claimed: string; vested: string };
  claimable: string;
  maxVestableAmount: string;
  maxVestableAmountExact: string;
  averageStakedAmount: string;
  pair_token: string;
  allowance: string;
  hasEnoughReserveTokens: boolean;
}
export interface IEarn {
  earn?: {
    ibfr: IiBFR;
    blp: IBLPV2;
    arbblp: IBLPV2;
    esBfr: IesBfr;
    total_rewards: ITotalRewards;
    usdc: { wallet_balance: string; allowance: string };
    arb: { wallet_balance: string; allowance: string };
  };
  vest?: { ibfr: IVestToken; blp: IVestToken; arbblp: IVestToken };
}
