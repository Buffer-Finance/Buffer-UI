import { useUserAccount } from '@Hooks/useUserAccount';
import { BlueBtn } from '@Views/Common/V2-Button';
import { ethers } from 'ethers';
import { useState } from 'react';
import { ValidationRow } from './ValidationRow';
import './index.css';
import { useBeginTransferData } from './useBeginTransferData';

export const BeginTransferAccount = () => {
  const [receiver, setReceiver] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isTransferSubmittedModalVisible, setIsTransferSubmittedModalVisible] =
    useState(false);
  const { address: account } = useUserAccount();
  let parsedReceiver = ethers.constants.AddressZero;
  if (ethers.utils.isAddress(receiver)) {
    parsedReceiver = receiver;
  }

  const data = useBeginTransferData({
    account,
    parsedReceiver,
  });
  if (data === undefined) return <div>loading...</div>;
  console.log(data);
  const {
    bfrAllowance,
    bfrStaked,
    bfrVesterBalance,
    blpVester2Balance,
    blpVesterBalance,
    cumulativeBfrRewards,
    cumulativeBlpRewards,
    cumulativeBlpRewards2,
    pendingReceiver,
    pendingReceiver2,
    transferredCumulativeBfrRewards,
    transferredCumulativeBlpRewards,
    transferredCumulativeBlpRewards2,
  } = data;

  const needApproval = bfrAllowance && bfrStaked && bfrStaked.gt(bfrAllowance);

  const hasVestedBfr = bfrVesterBalance && bfrVesterBalance.gt(0);
  const hasVestedBlp = blpVesterBalance && blpVesterBalance.gt(0);
  const hasStakedBfr =
    (cumulativeBfrRewards && cumulativeBfrRewards.gt(0)) ||
    (transferredCumulativeBfrRewards && transferredCumulativeBfrRewards.gt(0));
  const hasStakedBlp =
    (cumulativeBlpRewards && cumulativeBlpRewards.gt(0)) ||
    (transferredCumulativeBlpRewards && transferredCumulativeBlpRewards.gt(0));
  const hasPendingReceiver =
    pendingReceiver && pendingReceiver !== ethers.constants.AddressZero;

  const getError = () => {
    if (!account) {
      return `Wallet is not connected`;
    }
    if (hasVestedBfr) {
      return `Vested BFR not withdrawn`;
    }
    if (hasVestedBlp) {
      return `Vested BLP not withdrawn`;
    }
    if (!receiver || receiver.length === 0) {
      return `Enter Receiver Address`;
    }
    if (!ethers.utils.isAddress(receiver)) {
      return `Invalid Receiver Address`;
    }
    if (hasStakedBfr || hasStakedBlp) {
      return `Invalid Receiver`;
    }
    if (
      (parsedReceiver || '').toString().toLowerCase() ===
      (account || '').toString().toLowerCase()
    ) {
      return `Self-transfer not supported`;
    }

    if (
      (parsedReceiver || '').length > 0 &&
      (parsedReceiver || '').toString().toLowerCase() ===
        (pendingReceiver || '').toString().toLowerCase()
    ) {
      return `Transfer already initiated`;
    }
  };

  function onClickPrimary() {}

  const isPrimaryEnabled = () => {
    const error = getError();
    if (error) {
      return false;
    }
    if (isApproving) {
      return false;
    }
    if (isTransferring) {
      return false;
    }
    return true;
  };

  const getPrimaryText = () => {
    const error = getError();
    if (error) {
      return error;
    }
    if (needApproval) {
      return `Approve BFR`;
    }
    if (isApproving) {
      return `Approving...`;
    }
    if (isTransferring) {
      return `Transferring`;
    }

    return `Begin Transfer`;
  };
  return (
    <div className="BeginAccountTransfer Page page-layout">
      {/* <Modal
    isVisible={istransferSubmittedModalVisible}
    setIsVisible={setIstransferSubmittedModalVisible}
    label={`transfer Submitted`}
  >
    <div>Your transfer has been initiated.</div>
    <br />
    <br />
    <Link className="App-cta" to={completetransferLink}>
      <div>Continue</div>
    </Link>
  </Modal> */}
      <div className="Page-title-section">
        <div className="Page-title">
          <div>Transfer Account</div>
        </div>
        <div className="Page-description">
          <div>
            Please only use this for full account transfers.
            <br />
            This will transfer all your BFR, esBFR, BLP and Multiplier Points to
            your new account.
            <br />
            transfers are only supported if the receiving account has not staked
            BFR or BLP tokens before.
            <br />
            transfers are one-way, you will not be able to transfer staked
            tokens back to the sending account.
          </div>
        </div>
        {/* {hasPendingReceiver && (
      <div className="Page-description">
        <div>
          You have a <Link to={pendingtransferLink}>pending transfer</Link> to {pendingReceiver}.
        </div>
      </div>
    )} */}
      </div>
      <div className="Page-content">
        <div className="input-form">
          <div className="input-row">
            <label className="input-label">
              <div>Receiver Address</div>
            </label>
            <div>
              <input
                type="text"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="text-input"
              />
            </div>
          </div>
          <div className="BeginAccountTransfer-validations">
            <ValidationRow isValid={!hasVestedBfr}>
              <div>Sender has withdrawn all tokens from BFR Vesting Vault</div>
            </ValidationRow>
            <ValidationRow isValid={!hasVestedBlp}>
              <div>Sender has withdrawn all tokens from BLP Vesting Vault</div>
            </ValidationRow>
            <ValidationRow isValid={!hasStakedBfr}>
              <div>Receiver has not staked BFR tokens before</div>
            </ValidationRow>
            <ValidationRow isValid={!hasStakedBlp}>
              <div>Receiver has not staked BLP tokens before</div>
            </ValidationRow>
          </div>
          <div className="input-row">
            <BlueBtn
              className="w-full"
              isDisabled={isPrimaryEnabled()}
              onClick={onClickPrimary}
            >
              {getPrimaryText()}
            </BlueBtn>
          </div>
        </div>
      </div>
    </div>
  );
};
