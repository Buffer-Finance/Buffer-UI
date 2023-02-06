import MarketConfig from 'public/config.json'


export function getContract(chainId:'ddsfd', name: "referral") {
  const environment =  import.meta.env.VITE_ENV.toLowerCase() == 'testnet' ? 'arbitrum-test' :'arbitrum-main' 
  const contract = MarketConfig[environment].referral_storage
  return contract;
}
