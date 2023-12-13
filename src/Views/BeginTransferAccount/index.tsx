import { useToast } from '@Contexts/Toast';
import { useActiveChain } from '@Hooks/useActiveChain';
import { useUserAccount } from '@Hooks/useUserAccount';
import { useWriteCall } from '@Hooks/useWriteCall';
import { gt } from '@Utils/NumString/stringArithmatics';
import { BlueBtn } from '@Views/Common/V2-Button';
import RewardRouterAbi from '@Views/Earn/Config/Abis/RewardRouterV2.json';
import { getConfig } from '@Views/TradePage/utils/getConfig';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ModalBase } from 'src/Modals/BaseModal';
import { erc20ABI } from 'wagmi';
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
  const { activeChain } = useActiveChain();
  const navigate = useNavigate();
  const config = getConfig(activeChain.id);
  const { writeCall: approve } = useWriteCall(
    config.EarnConfig.iBFR,
    erc20ABI as any
  );
  const { writeCall: transfer1 } = useWriteCall(
    config.EarnConfig.RewardRouter,
    RewardRouterAbi
  );
  const { writeCall: transfer2 } = useWriteCall(
    config.EarnConfig.RewardRouter2,
    RewardRouterAbi
  );
  const toastify = useToast();
  let parsedReceiver = ethers.constants.AddressZero;
  if (ethers.utils.isAddress(receiver)) {
    parsedReceiver = receiver;
  }

  const data = useBeginTransferData({
    account,
    parsedReceiver,
  });
  useEffect(() => {
    document.title = 'Account Transfer | Buffer';
  }, []);
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

  const needApproval = bfrAllowance && bfrStaked && gt(bfrStaked, bfrAllowance);

  const hasVestedBfr = bfrVesterBalance && gt(bfrVesterBalance, '0');
  const hasVestedBlp = blpVesterBalance && gt(blpVesterBalance, '0');
  const hasVestedBlp2 = blpVester2Balance && gt(blpVester2Balance, '0');
  const hasStakedBfr =
    (cumulativeBfrRewards && gt(cumulativeBfrRewards, '0')) ||
    (transferredCumulativeBfrRewards &&
      gt(transferredCumulativeBfrRewards, '0'));
  const hasStakedBlp =
    (cumulativeBlpRewards && gt(cumulativeBlpRewards, '0')) ||
    (transferredCumulativeBlpRewards &&
      gt(transferredCumulativeBlpRewards, '0'));
  const hasStakedBlp2 =
    (cumulativeBlpRewards2 && gt(cumulativeBlpRewards2, '0')) ||
    (transferredCumulativeBlpRewards2 &&
      gt(transferredCumulativeBlpRewards2, '0'));

  const hasPendingReceiver =
    pendingReceiver && pendingReceiver !== ethers.constants.AddressZero;
  const hasPendingReceiver2 =
    pendingReceiver2 && pendingReceiver2 !== ethers.constants.AddressZero;

  const getError = () => {
    if (!account) {
      return `Wallet is not connected`;
    }
    if (hasVestedBfr) {
      return `Vested BFR not withdrawn`;
    }
    if (hasVestedBlp) {
      return `Vested uBLP not withdrawn`;
    }
    if (hasVestedBlp2) {
      return `Vested aBLP not withdrawn`;
    }
    if (!receiver || receiver.length === 0) {
      return `Enter Receiver Address`;
    }
    if (!ethers.utils.isAddress(receiver)) {
      return `Invalid Receiver Address`;
    }
    if (hasStakedBfr || hasStakedBlp || hasStakedBlp2) {
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

  async function onClickPrimary() {
    if (needApproval) {
      try {
        setIsApproving(true);
        await approve(() => {}, 'approve', [
          config.EarnConfig.StakedBfrTracker,
          '115792089237316195423570985008687907853269984665640564039457584007913129639935',
        ]);
      } catch (e) {
        toastify({
          type: 'error',
          msg: 'Error approving BFR',
          id: 'error-approve-bfr',
        });
      } finally {
        setIsApproving(false);
        return;
      }
    }

    try {
      setIsTransferring(true);

      await transfer1(() => {}, 'signalTransfer', [parsedReceiver]);
      await transfer2(() => {}, 'signalTransfer', [parsedReceiver]);
      setIsTransferSubmittedModalVisible(true);
    } catch (e) {
      toastify({
        type: 'error',
        msg: 'Error transferring account',
        id: 'error-transfer-account',
      });
    } finally {
      setIsTransferring(false);
    }
  }

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
  const completeTransferLink = `/complete_account_transfer/${account}/${parsedReceiver}`;
  const pendingTransferLink = `/complete_account_transfer/${account}/${pendingReceiver}`;

  const navigteToCompleteTransfer = () => {
    navigate(completeTransferLink);
  };

  return (
    <div className="BeginAccountTransfer Page page-layout">
      <ModalBase
        open={isTransferSubmittedModalVisible}
        onClose={() => setIsTransferSubmittedModalVisible(false)}
      >
        <div className="text-f15">Your transfer has been initiated.</div>
        <br />
        <br />
        <BlueBtn onClick={navigteToCompleteTransfer}>
          <div>Continue</div>
        </BlueBtn>
      </ModalBase>
      <div className="Page-title-section">
        <div className="Page-title">
          <div>Transfer Account</div>
        </div>
        <div className="Page-description">
          <div>
            Please only use this for full account transfers.
            <br />
            This will transfer all your BFR, esBFR, uBLP, aBLP and Multiplier
            Points to your new account.
            <br />
            transfers are only supported if the receiving account has not staked
            BFR, uBLP or aBLP tokens before.
            <br />
            transfers are one-way, you will not be able to transfer staked
            tokens back to the sending account.
          </div>
        </div>
        {(hasPendingReceiver || hasPendingReceiver2) && (
          <div className="Page-description">
            <div>
              You have a <Link to={pendingTransferLink}>pending transfer</Link>{' '}
              to {pendingReceiver}.
            </div>
          </div>
        )}
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
              <div>Sender has withdrawn all tokens from uBLP Vesting Vault</div>
            </ValidationRow>
            <ValidationRow isValid={!hasStakedBfr}>
              <div>Receiver has not staked BFR tokens before</div>
            </ValidationRow>
            <ValidationRow isValid={!hasStakedBlp}>
              <div>Receiver has not staked uBLP tokens before</div>
            </ValidationRow>
            <ValidationRow isValid={!hasStakedBlp2}>
              <div>Receiver has not staked aBLP tokens before</div>
            </ValidationRow>
          </div>
          <div className="input-row">
            <BlueBtn
              className="w-full"
              isDisabled={!isPrimaryEnabled()}
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
