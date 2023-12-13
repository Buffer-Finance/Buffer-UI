import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { BlueBtn } from '@Views/Common/V2-Button';
import RewardRouterAbi from '@Views/Earn/Config/Abis/RewardRouterV2.json';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCopyToClipboard } from 'react-use';

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
  const { writeCall } = useWriteCall(
    config.EarnConfig.RewardRouter,
    RewardRouterAbi
  );
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
      await writeCall(() => {}, 'acceptTransfer', [sender]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsConfirming(false);
    }
    // const contract = new ethers.Contract(rewardRouterAddress, RewardRouterAbi, signer);

    // callContract(chainId, contract, "acceptTransfer", [sender], {
    //   sentMsg: t`Transfer submitted!`,
    //   failMsg: t`Transfer failed.`,
    //   setPendingTxns,
    // })
    //   .then(async (res) => {
    //     setIsTransferSubmittedModalVisible(true);
    //   })
    //   .finally(() => {
    //     setIsConfirming(false);
    //   });
  };

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
      {/* <Modal
        isVisible={isTransferSubmittedModalVisible}
        setIsVisible={setIsTransferSubmittedModalVisible}
        label="Transfer Completed"
      >
        <div>Your transfer has been completed.</div>
        <br />
        <br />
        <Link className="App-cta" to="/earn">
          <div>Continue</div>
        </Link>
      </Modal> */}
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
