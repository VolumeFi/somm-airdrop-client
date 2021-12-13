import { useState, useEffect, useMemo } from 'react'

import { IAirdropRewards, getAirdropRewards, sortRewardsData } from '../utils/airdrop'
import { getOnlyDigitalValue, getOnlyPointsValue } from '../utils/number'
import { makeMerkleTree, getMerkleProof } from '../utils/merkletree'

import Button from 'components/Button/Button'
import AlertPanel from '../components/AlertPanel/AlertPanel';

import styles from 'styles/Airdrop.module.css'
import BigNumber from 'bignumber.js';

const NoAirdrop = () => {
  return (
    <div className={`${styles.noRewardContainer}`}>
      <AlertPanel type="error" text="This wallet address was not found in the airdrop listing" />
      <h2>Wallet Address Not Found.</h2>
      <p>Please try with another wallet!</p>
    </div>
  )
}

const AlreadyClaimed = () => {
  return (
    <div className={`${styles.noRewardContainer}`}>
      <h2>You already have claimed.</h2>
      <p>Please try with another wallet!</p>
    </div>
  )
}

const RewardsItem = ({ text, value }) => {
  return (
    <div className={styles.rewardsItem}>
      <div className={styles.rewardsItemText}>{text}</div>
      <div className={styles.rewardsItemValue}>
        <span>{value}</span>
        <img src="/assets/sommelier.png" />
      </div>
    </div>
  )
}

const ClaimRewards = ({ rewards, library }) => {
  
  const [loading, setLoading] = useState(false)

  const handleClaim = async () => {

  
  }

  return (
    <div className={styles.homeContainer}>
      <AlertPanel type="success" text="This wallet address is eligible for the airdrop!" />
      <h2>SOMM community Rewards</h2>
      <p>There are three types of wallet adresses that qualify for sommelier community rewards, below you will see what type of reward you are eligible for and the amount of tokens you will receive.</p>

      <div className={styles.rewardsPanel}>
        <RewardsItem text="Sommelier Pairings Participation" value={rewards.sommPairingParticipation.toFixed(0).toString()} />
        <RewardsItem text="Sommelier Pairings Position-weighted" value={rewards.sommPairingPositionWeighted.toFixed(4).toString()} />
        <RewardsItem text="Uniswap V3 LPs" value={rewards.uniswapV3LP.toFixed(4).toString()} />
      </div>

      <h2>Claim your tokens</h2>
      <p>Your wallet is eligible for the airdrop! View your tokens below, and start the claim process. </p>

      <div className={styles.receivePanel}>
        <p>You will receive</p>
        <div className={styles.receiveValue}>
          <span className={styles.receiveValueText}>{`${getOnlyDigitalValue(rewards.total.toNumber())}${getOnlyPointsValue(rewards.total.toNumber()) > 0 ? '.' : ''}`}</span>
          <span className={styles.receiveValuePoints}>{getOnlyPointsValue(rewards.total.toNumber()).toFixed(7).substring(2)}</span>
          <div className={styles.receiveValueImg}>
            <img src="/assets/sommelier.png" />
          </div>
        </div>
      </div>
      
      <Button 
        className={styles.claimButton}
        onClick={(e) => {
          
          handleClaim()
        }}
        disabled={loading}
      >
        <span>{loading ? 'Claiming...' : 'Start your claim process'}</span>
        {!loading && <img src="/assets/right-arrow.png" />}
      </Button>
    </div>
  )
}

export default function Home({ library, state, dispatch }) {

  const [received, setReceived] = useState<boolean>(false)
  const [rewards, setRewards] = useState<IAirdropRewards>(getAirdropRewards(state.account.address.toLowerCase()))

  useEffect(() => {
    const receivedClaim = async () => {
      if (library?.wallet?.address) {
        const receivedStatus = await library.methods.Airdrop.received(library.wallet.address);
        setReceived(receivedStatus);
      }
    }
    receivedClaim();
  }, [library?.wallet?.address])

  if (received) {
    return (
      <div className='container container-center'>
      <AlreadyClaimed />
      </div>
    )
  }

  return (
    <div className='container container-center'>
      {rewards.total.comparedTo(new BigNumber(0)) <= 0 && (
        <NoAirdrop />
      )}
      {rewards.total.comparedTo(new BigNumber(0)) > 0 && (
        <ClaimRewards rewards={rewards} library={library}/>
      )}
    </div>
  )
}
