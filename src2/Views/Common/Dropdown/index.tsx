import { MouseEventHandler } from 'react';
import BufferDropdown from '../BufferDropdown';
import DisconnectIcon from 'src/SVG/Elements/Disconnect';
import useConnectionDrawer from '@Hooks/Utilities/useOpenConnectionDrawer';
import { atom, useAtom } from 'jotai';
import { isDrawerOpen } from 'src/globalStore';
import Wallet from 'public/ComponentSVGS/wallet';
import { ArrowDropDownRounded } from '@mui/icons-material';
import { useDisconnect, useNetwork } from 'wagmi';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useActiveChain } from '@Hooks/useActiveChain';
import { ConnectButton , useAccountModal, useChainModal, useConnectModal} from '@rainbow-me/rainbowkit'

interface IProps {
  inDrawer?: boolean;
}
export const connectedChainAtom = atom<any>(null);
const AccountConnectionDropdown: React.FC<IProps> = ({ inDrawer }) => {
  const { address: account } = useUserAccount();
  const { chain, chains } = useNetwork();
  const { activeChain } = useActiveChain();
  const activeChainName = activeChain?.name;
  const { disconnect } = useDisconnect();
  const { openWalletDrawer } = useConnectionDrawer();
  const [isConnectionDrawerOpen, setIsConnectionDrawerOpen] =
  useAtom(isDrawerOpen);
  
  const { openConnectModal } = useConnectModal();
  // const connect: MouseEventHandler<HTMLDivElement> = (e) => {
  //   // dispatch({ type: "SET_DRAWER", payload: true });
  //   setIsConnectionDrawerOpen(true);
  //   e.stopPropagation();
  //   openWalletDrawer();
  // };

  if (
    activeChainName &&
    chain &&
    chain.id !== chains.find((chain) => chain.name === activeChainName)?.id
  ) {
    return (
      <div
        className={`flex items-center justify-center text-f13 bg-cross-bg h-[30px] w-fit rounded-[7px] px-3 cursor-pointer  ${
          isConnectionDrawerOpen ? '' : 'hover:brightness-125'
        }`}
        onClick={openConnectModal}
      >
        <Wallet className="mr-[6px]" />
        {'Change network'}
      </div>
    );
  }

  return (
    <BufferDropdown
      items={[{ name: 'Disconnect' }]}
      initialActive={0}
      dropdownBox={(activeItem, isOpen) => (
        <div
          className={`flex items-center text-f13 h-[30px] w-fit rounded-[7px] pl-3 ${
            isOpen || isConnectionDrawerOpen
              ? 'bg-3'
              : 'bg-4 hover:brightness-125 hover:bg-1'
          } ${!account ? 'pr-[10px]' : 'pr-[1px]'}`}
          onClick={ openConnectModal}
        >
          <Wallet className="mr-[6px] ml-1" />

          <span>
            {account
              ? `${account.slice(0, 4)}...${account.slice(-4)}`
              : 'Connect'}
          </span>

          {account && (
            <ArrowDropDownRounded
              className={`dropdown-arrow ${isOpen && 'rotate'}`}
            />
          )}
        </div>
      )}
      className="bg-1"
      item={(singleItem, handleClose, onChange, active) => (
        <button
          key={singleItem.name}
          className={
            'flex min-w-max items-center text-4 hover:text-1 px-[20px] py-4 text-f13'
          }
          onClick={() => {
            // place wagmi code here
            disconnect();
          }}
        >
          <DisconnectIcon />
          <span className="pl-3">{singleItem.name}</span>
        </button>
      )}
    />
  );
};
export default AccountConnectionDropdown;
