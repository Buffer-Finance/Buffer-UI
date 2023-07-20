import { ExceptArbitrum } from '@Views/Common/ChainNotSupported';
import { OtherChainBLP } from './Cards/OtherChainBLP';

export const OtherChainBLPcard = () => {
  return (
    <ExceptArbitrum hide>
      <OtherChainBLP />
    </ExceptArbitrum>
  );
};
