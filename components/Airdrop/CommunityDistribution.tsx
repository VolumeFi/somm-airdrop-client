import React from 'react'

import { IAirdropRewards } from '../../utils/airdrop'
import { getOnlyDigitalValue, getOnlyPointsValue } from '../../utils/number'

import Button from '../Button/Button'
import AlertPanel from '../AlertPanel/AlertPanel'
import RewardsItem from './RewardsItem'

import styles from 'styles/Airdrop.module.css'

const CommunityDistribution = ({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) => {
  return (
    <>
      <h2>SOMM Community Distribution</h2>
      <p>There are three types of wallet addresses that qualify for the SOMM community reward:</p>

      <ul>
        <li>Sommelier Pairings app wallets that interact with the Pairings vyper contracts</li>
        <li>Sommelier Pairings app wallets that interact with the Pairings vyper contracts</li>
        <li>Sommelier Pairings app wallets that interact with the Pairings vyper contracts</li>
      </ul>

      <p>At a high level, all three types of wallet addresses receive a reward based on the amount of liquidity and duration (how long they provided that liquidity). Sommelier Pairings app wallets, additionally receive a <strong>flat participation reward</strong>. The distribution is meant to reward and encourage early Sommelier wallets as well as to encourage LPs on Uniswap V3 and Osmosis to bring their liquidity to Sommelier for the upcoming launch of Cellars on Uniswap v3 and Osmosis. </p>

      <img src='assets/token-chart.png' />

      <div className={styles.buttonGroup}>
        <Button className={styles.backButton} onClick={(e) => onBack()}>
          <img src="/assets/left-arrow.png" />
          <span>Back</span>
        </Button>
        <Button className={styles.nextButton} onClick={(e) => onNext()}>
          <span>Next</span>
          <img src="/assets/right-arrow.png" />
        </Button>
      </div>
    </>
  )
}

export default CommunityDistribution
