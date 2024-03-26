// @ts-nocheck

import { updateProps } from 'src/Interfaces/interfaces';
import { useWriteCall } from '@Hooks/useWriteCall';
import traderNFTABI from '@Views/NFT/Config/traderNFT.json';

export function useNFTContract(contract: string) {
  const { writeCall } = useWriteCall(contract, traderNFTABI);

  const claim = (amount, update: (props: updateProps) => void) => {
    writeCall(
      update,
      'claim',
      [],
      { value: amount },
      {
        content: 'Your NFT has been minted',
      }
    );
  };

  return { claim };
}
