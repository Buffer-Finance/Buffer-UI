import Background from './style';
import BufferDropdown from '@Views/Common/BufferDropdown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AccountConnectionDropdown from '@Views/Common/Dropdown';
import { changeRoute } from '@Utils/appControls/changeRoute';
import { ArrowDropDownRounded } from '@mui/icons-material';
import { useAccount, Chain } from 'wagmi';
import { getChains } from 'src/Providers/wagmiClient';
import * as chain from 'wagmi/chains';
import { useMemo } from 'react';

interface INavbar {
  className?: string;
}
export const chainImageMappipng = {
  [chain.polygon.name]:
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/v1684086043/polygon2.png',
  [chain.polygonMumbai.name]:
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/v1684086043/polygon2.png',
  [chain.arbitrum.name]: '/Chains/ARBITRIUM.png',
  [chain.arbitrumGoerli.name]: '/Chains/ARBITRIUM.png',
  ['BSC']: '/Chains/BSC.png',
};

export const chainSymbolMapping = {
  [chain.polygon.name]: 'POLYGON',
  [chain.polygonMumbai.name]: 'POLYGON',
  [chain.arbitrum.name]: 'ARBITRUM',
  [chain.arbitrumGoerli.name]: 'ARBITRUM',
  ['BSC']: 'BSC',
};

export const useChains = () => {
  let tempChain = useMemo(() => {
    return { activeChain: chain.arbitrum };
  }, []);
  return tempChain;
};

const ChainAccountDropdowns: React.FC<INavbar> = ({ className }) => {
  const { activeChain } = useChains();

  let disabled = false;
  if (typeof window !== 'undefined') {
    if (window.location.href.includes('migrate')) {
      disabled = true;
    }
  }
  return (
    <Background>
      <AccountConnectionDropdown inDrawer />
    </Background>
  );
};

export default ChainAccountDropdowns;
