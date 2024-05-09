import { isOceanSwapOpenAtom } from '@Views/Common/OpenOceanWidget';
import { usePoolByAsset } from '@Views/ABTradePage/Hooks/usePoolByAsset';
import { isTestnet } from '@Views/ABTradePage/config';
import { useSetAtom } from 'jotai';
import { Link } from 'react-router-dom';

export function BuyUSDCLink({ token }: { token: 'USDC' | 'BFR' | 'ARB' }) {
  const pools = usePoolByAsset();
  console.log(`BuyUsdcLink-pools: `, pools);
  const setSwapAtom = useSetAtom(isOceanSwapOpenAtom);
  const link = isTestnet
    ? `/faucet`
    : `https://app.uniswap.org/#/tokens/arbitrum/${pools?.[token].tokenAddress}`;
  if (isTestnet)
    return (
      <Link to={link} target={!isTestnet ? '_blank' : '_self'}>
        <div className="text-f10 mb-[1.5px] text-3 underline underline-offset-1 font-bold cursor-pointer">
          {/* <EnterIcon /> */}
          Buy {token}
        </div>
      </Link>
    );
  return (
    <div
      className="text-f10 mb-[1.5px] text-3 underline underline-offset-1 font-bold cursor-pointer"
      onClick={() => setSwapAtom(token)}
    >
      {/* <EnterIcon /> */}
      Buy {token}
    </div>
  );
}
