import React, { useState, useEffect } from 'react'

import Button from 'components/Button/Button'
import AlertPanel from '../components/AlertPanel/AlertPanel';

import { numberWithCommas, getOnlyDigitalValue, getOnlyPointsValue } from '../utils/number'
import { getOsmosisRewards } from '../utils/airdrop'

import styles from 'styles/Airdrop.module.css'
import BigNumber from 'bignumber.js';

const RewardInput = ({ onStartClaim, onChangeAddress, address }) => (
  <>
    <h2>SOMM Osmosis Rewards </h2>
    <p>
      Enter your wallet address to check if you were elegible for the airdrop and the amount of SOMM token you received.
        </p>
    <div className={styles.walletInputPanel}>
      <span>Enter a wallet address</span>
      <input autoFocus type="text" value={address} onChange={(e) => onChangeAddress(e.target.value)} />
    </div>
    <div className={styles.buttonGroup}>
      <Button
        className={styles.claimButton}
        onClick={(e) => onStartClaim()}
      >
        <span>Check your rewards</span>
        <img src='/assets/right-arrow.png' />
      </Button>
    </div>
  </>
)

const OsmosisReward = ({ onBack, address}) => {

  const [rewards, setRewards] = useState<BigNumber>(new BigNumber(0))

  useEffect(() => {
    setRewards(getOsmosisRewards(address))
  }, [address])

  return (
    <>
      {rewards.comparedTo(new BigNumber(0)) === 1 ? (
        <>
          <AlertPanel type="success" text="This wallet address is eligible for the airdrop!" />
          <h2>SOMM Osmosis Rewards </h2>
          <p>Your Osmosis wallet was eligible for the airdrop. The number of tokens written below was sent to your wallet address.</p>

          <div className={styles.receivePanel}>
            <p>You have received</p>
            <div className={styles.receiveValue}>
              <span className={styles.receiveValueText}>{`${numberWithCommas(getOnlyDigitalValue(rewards.toNumber()))}${getOnlyPointsValue(rewards.toNumber()) > 0 ? '.' : ''}`}</span>
              <span className={styles.receiveValuePoints}>{getOnlyPointsValue(rewards.toNumber()).toFixed(7).substring(2)}</span>
              <div className={styles.receiveValueImg}>
                <img src="/assets/sommelier.png" />
              </div>
            </div>
          </div>

          <a
            className={styles.share}
            target="_blank"
            href={`https://twitter.com/intent/tweet?text=I%20just%20claimed%20${rewards.toFormat(2)}%20$SOMM%20from%20@sommfinance.%20Cheers!`}
          >
            <span>Share the Good News</span>
            <img src="/assets/twitter.png" />
          </a>

          <a href="https://app.osmosis.zone" target="_blank" className={styles.osmosisLink}>
              <span>Go to Osmosis</span>
              <img src="/assets/osmosis.png" />
          </a>

          <Button className={styles.return} onClick={(e) => onBack()}>Return to home page</Button>
        </>
      ) : (
        <>
          <AlertPanel type="error" text="This wallet address was not found in the airdrop listing. Please try with another wallet" />
          <Button className={styles.return} onClick={(e) => onBack()}>Return to home page</Button>
        </>
      )}
    </>
  )
} 

export default function osmosis() {
  const [step, setStep] = useState<number>(0)
  const [address, setAddress] = useState<string>('')

  const handleRedirect = () => {
    window.location.href = "/"
  }

  return (
    <div className='container container-center'>
      <div className={`${styles.homeContainer}`}>
        <img src='/assets/osmosis2.png' className={styles.osmosisLogo} />
        {step === 0 && (
          <RewardInput
            onStartClaim={() => setStep(step + 1)}
            onChangeAddress={(addr) => setAddress(addr)}
            address={address}
          />
        )}
        {step === 1 && <OsmosisReward address={address} onBack={() => handleRedirect()} /> }
      </div>
    </div>
  )
}
