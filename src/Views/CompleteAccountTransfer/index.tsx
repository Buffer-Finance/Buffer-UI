import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BlueBtn } from '@Views/Common/V2-Button';
import RewardRouterAbi from '@Views/Earn/Config/Abis/RewardRouterV2.json';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';
import { ModalBase } from 'src/Modals/BaseModal';

export default function CompleteAccountTransfer() {
  const [, copyToClipboard] = useCopyToClipboard();
  const { sender, receiver } = useParams();
  const { address: account } = useUserAccount();
  const isSenderAndReceiverValid =
    ethers.utils.isAddress(sender ?? '') &&
    ethers.utils.isAddress(receiver ?? '');
  const [isTransferSubmittedModalVisible, setIsTransferSubmittedModalVisible] =
    useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const isCorrectAccount =
    (account || '').toString().toLowerCase() ===
    (receiver || '').toString().toLowerCase();
  const { activeChain } = useActiveChain();
  const config = getConfig(activeChain.id);
  const { writeCall: claim1 } = useWriteCall(
    config.EarnConfig.RewardRouter,
    RewardRouterAbi
  );
  const { writeCall: claim2 } = useWriteCall(
    config.EarnConfig.RewardRouter2,
    RewardRouterAbi
  );
  const navigate = useNavigate();
  const toastify = useToast();

  const getError = () => {
    if (!account) {
      return `Wallet is not connected`;
    }
    if (!isCorrectAccount) {
      return `Incorrect Account`;
    }
  };

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isConfirming) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    return `Complete Transfer`;
  };

  const onClickPrimary = async () => {
    setIsConfirming(true);
    try {
      await claim1(() => {}, 'acceptTransfer', [sender]);
      await claim2(() => {}, 'acceptTransfer', [sender]);
      setIsTransferSubmittedModalVisible(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsConfirming(false);
    }
  };

  const navigateToEarn = () => {
    navigate('/earn');
  };
  useEffect(() => {
    document.title = 'Account Transfer | Buffer';
  }, []);
  if (!isSenderAndReceiverValid) {
    return (
      <div className="CompleteAccountTransfer Page page-layout">
        <div className="Page-title-section">
          <div className="Page-title">
            <div>Complete Account Transfer</div>
          </div>
          <div className="Page-description">
            <div>Invalid Transfer Addresses: Please check the url.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="CompleteAccountTransfer Page page-layout">
      <ModalBase
        open={isTransferSubmittedModalVisible}
        onClose={() => setIsTransferSubmittedModalVisible(false)}
      >
        <div className="text-f15">Your transfer has been completed.</div>
        <br />
        <br />
        <BlueBtn onClick={navigateToEarn}>
          <div>Continue</div>
        </BlueBtn>
      </ModalBase>
      <div className="Page-title-section">
        <div className="Page-title">
          <div>Complete Account Transfer</div>
        </div>
        {!isCorrectAccount && (
          <div className="Page-description">
            <div>
              To complete the transfer, you must switch your connected account
              to {receiver}.
            </div>
            <br />
            <br />
            <div>
              You will need to be on this page to accept the transfer,{' '}
              <span
                onClick={() => {
                  copyToClipboard(window.location.href);
                  toastify({
                    type: 'success',
                    msg: 'Link copied to your clipboard',
                    id: 'copy-link-complete-transfer',
                  });
                }}
              >
                click here
              </span>{' '}
              to copy the link to this page if needed.
            </div>
            <br />
            <br />
          </div>
        )}
        {isCorrectAccount && (
          <div className="Page-description">
            <div>You have a pending transfer from {sender}.</div>
            <br />
          </div>
        )}
      </div>
      {isCorrectAccount && (
        <div className="Page-content">
          <div className="input-form">
            <div className="input-row">
              <BlueBtn
                isDisabled={!isPrimaryEnabled()}
                onClick={onClickPrimary}
              >
                {getPrimaryText()}
              </BlueBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
