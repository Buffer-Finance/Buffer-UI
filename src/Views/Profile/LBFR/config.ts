export type LBFRconfigType = {
  startTimestamp: number;
};

export const LBFRconfig: {
  [key: number]: LBFRconfigType;
} = {
  421613: {
    startTimestamp: 1675507870,
  },
  42161: {
    startTimestamp: 1680519070,
  },
};

export const getLBFRconfig = (chainId: number) => {
  if (!LBFRconfig[chainId])
    throw new Error('LBFRconfig not found for chainId: ' + chainId);
  return LBFRconfig[chainId];
};
