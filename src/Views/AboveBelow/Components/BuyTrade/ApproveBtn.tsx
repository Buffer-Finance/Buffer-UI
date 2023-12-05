import { useToast } from '@Contexts/Toast';
import { useWriteCall } from '@Hooks/useWriteCall';
import { ConnectionRequired } from '@Views/Common/Navbar/AccountDropdown';
import { BlueBtn } from '@Views/Common/V2-Button';
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
        '115792089237316195423570985008687907853269984665640564039457584007913129639935',
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