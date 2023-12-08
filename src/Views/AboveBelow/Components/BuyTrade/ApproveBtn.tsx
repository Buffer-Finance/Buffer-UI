import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
import { MAX_APPROVAL_VALUE } from '@Views/TradePage/config';
import { useState } from 'react';
import { erc20ABI } from 'wagmi';

export const ApproveBtn: React.FC<{
  tokenAddress: string;
  routerAddress: string;
}> = ({ tokenAddress, routerAddress }) => {
  const toastify = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const { writeCall: approveCall } = useWriteCall(
    tokenAddress,
    erc20ABI as any
  );

  async function approve() {
    try {
      setLoading(true);
      await approveCall(() => {}, 'approve', [
        routerAddress,
        MAX_APPROVAL_VALUE,
      ]);
    } catch (e) {
      toastify({
        type: 'error',
        msg: (e as Error).message,
        id: 'approve-above-below',
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <ConnectionRequired>
      <BlueBtn onClick={approve} isLoading={loading} isDisabled={loading}>
        Approve
      </BlueBtn>
    </ConnectionRequired>
  );
};
