import MarketConfig from 'public/config.json'


export function getContract(chainId:string | number) {
  const contract = MarketConfig[chainId].referral_storage
  return contract;
}
