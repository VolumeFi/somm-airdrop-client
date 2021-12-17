import React, { useEffect } from 'react';

import { IAirdropRewards } from '../../utils/airdrop';
import { getOnlyDigitalValue, getOnlyPointsValue } from '../../utils/number';

import Button from '../Button/Button';

import styles from 'styles/Airdrop.module.css';

const NotClaimed = ({ onBack, onRetry, loading }) => (
  <>
    <h2>Confirm with Wallet</h2>
    <p>Please approve the transaction to claim your tokens.</p>
    <div className={styles.transactionResult}>
      <img src="assets/loading.gif" />
      <div className={styles.text}>
        <h3>Claiming tokens</h3>
        <p>This trasaction happens on-chain, and will require paying gas</p>
      </div>
    </div>

    <div className={styles.buttonGroup}>
      <Button className={styles.backButton} onClick={(e) => onBack()}>
        <img src="/assets/left-arrow.png" />
        <span>Back</span>
      </Button>
      <Button
        className={styles.backButton}
        onClick={(e) => onRetry()}
        disabled={loading}
      >
        <span>Try again</span>
      </Button>
    </div>
  </>
);

const AlreadyClaimed = ({ rewards, onRedirect }) => (
  <>
    <h2>Claim successful!</h2>
    <p>This wallet address has already made its token claim!</p>

    <div className={styles.receivePanel}>
      <p>You have received</p>
      <div className={styles.receiveValue}>
        <span className={styles.receiveValueText}>{`${getOnlyDigitalValue(
          rewards.total.toNumber()
        )}${
          getOnlyPointsValue(rewards.total.toNumber()) > 0 ? "." : ""
        }`}</span>
        <span className={styles.receiveValuePoints}>
          {getOnlyPointsValue(rewards.total.toNumber()).toFixed(7).substring(2)}
        </span>
        <div className={styles.receiveValueImg}>
          <img src="/assets/sommelier.png" />
        </div>
      </div>
    </div>

    <Button className={styles.share}>
      <span>Share the Good News</span>
      <img src="/assets/twitter.png" />
    </Button>

    <Button className={styles.return} onClick={(e) => onRedirect()}>Return to home page</Button>
  </>
);

const TransactionSuccess = ({ onRedirect }) => (
  <>
    <h2>Claim successful!</h2>
    <div className={styles.congrats}>
      <span>Congratulations on claiming your</span>
      <div>SOMM! <img src="/assets/sommelier.png" /></div>
      Share the news with your friends!
    </div>

    <Button className={styles.share}>
      <span>Share the Good News</span>
      <img src="assets/twitter.png" />
    </Button>

    <Button className={styles.return} onClick={(e) => onRedirect()}>Return to home page</Button>
  </>
);

const ConfirmWallet = ({
  loading,
  received,
  transactionStatus,
  rewards,
  onBack,
  onClaim,
  onRedirect,
}: {
  loading: boolean;
  received: number;
  transactionStatus: boolean;
  rewards: IAirdropRewards;
  onBack: () => void;
  onClaim: () => void;
  onRedirect: () => void;
}) => {
  useEffect(() => {
    if (received === 2) {
      onClaim();
    }
  }, [received]);

  const handleRetry = () => {
    if (received === 2) {
      onClaim();
    }
  };

  return (
    <>
      {transactionStatus ? (
        <TransactionSuccess onRedirect={onRedirect} />
      ) : (
        <>
          {received === 2 && (
            <NotClaimed
              onBack={onBack}
              loading={loading}
              onRetry={handleRetry}
            />
          )}
          {received === 1 && <AlreadyClaimed rewards={rewards} onRedirect={onRedirect} />}
        </>
      )}
    </>
  );
};

export default ConfirmWallet;
