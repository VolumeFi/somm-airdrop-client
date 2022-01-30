import React from 'react'

import { IAirdropRewards } from '../../utils/airdrop'
import { numberWithCommas, getOnlyDigitalValue, getOnlyPointsValue } from '../../utils/number'

import Button from '../Button/Button'
import AlertPanel from '../AlertPanel/AlertPanel'
import RewardsItem from './RewardsItem'

import styles from 'styles/Airdrop.module.css'

const ClaimAmount = ({
  rewards,
  onStartClaim,
}: {
  rewards: IAirdropRewards;
  onStartClaim: () => void;
}) => {
  return (
    <>
      <AlertPanel type="success" text="This wallet address is eligible for the airdrop!" />
      <h2>SOMM community Rewards</h2>
      <p>There are three types of wallet adresses that qualify for sommelier community rewards, below you will see what type of reward you are eligible for and the amount of tokens you will receive.</p>

      <div className={styles.rewardsPanel}>
        <RewardsItem text="Sommelier Pairings Participation" value={rewards.sommPairingParticipation.toFormat()} />
        <RewardsItem text="Sommelier Pairings Position-weighted" value={rewards.sommPairingPositionWeighted.toFormat(0)} />
        <RewardsItem text="Uniswap V3 LPs" value={rewards.uniswapV3LP.toFormat(0)} />
      </div>

      <h2>Claim your tokens</h2>
      <p>Your wallet is eligible for the airdrop! View your tokens below, and start the claim process. </p>

      <div className={styles.receivePanel}>
        <p>You will receive</p>
        <div className={styles.receiveValue}>
          <span className={styles.receiveValueText}>{`${numberWithCommas(getOnlyDigitalValue(rewards.total.toNumber()))}${getOnlyPointsValue(rewards.total.toNumber()) > 0 ? '.' : ''}`}</span>
          <span className={styles.receiveValuePoints}>{getOnlyPointsValue(rewards.total.toNumber()).toFixed(7).substring(2)}</span>
          <div className={styles.receiveValueImg}>
            <img src="/assets/sommelier.png" />
          </div>
        </div>
      </div>

      <div className={styles.buttonGroup}>
        <Button
          className={styles.claimButton}
          onClick={(e) => onStartClaim()}
        >
          <span>Start your claim process</span>
          <img src='/assets/right-arrow.png' />
        </Button>
      </div>
    </>
  )
}

export default ClaimAmount
