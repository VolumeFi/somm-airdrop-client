import { useState } from 'react'

import { IAirdropRewards, getAirdropRewards, sortRewardsData } from '../utils/airdrop'


import { ClaimAmount, CommunityDistribution, ConfirmWallet } from 'components/Airdrop'
import Button from 'components/Button/Button'
import AlertPanel from '../components/AlertPanel/AlertPanel';

import styles from 'styles/Airdrop.module.css'
import BigNumber from 'bignumber.js';

const NoAirdrop = () => {
  const handleRedirect = () => {
    window.location.reload()
  }

  return (
    <div className={`${styles.noRewardContainer}`}>
      <AlertPanel type="error" text="This wallet address was not found in the airdrop listing. Please try with another wallet" />
      <Button className={styles.return} onClick={(e) => handleRedirect()}>Return to home page</Button>
    </div>
  )
}

const ClaimRewards = ({ rewards, library }) => {

  const [step, setStep] = useState<number>(0)   // wizard view

  const handleRedirect = () => {
    console.log(library)
    window.location.reload()
  }

  return (
    <div className={styles.homeContainer}>
      <div className={styles.homeIcon}>
        <img src='assets/sommelier.png' />
      </div>
      {step === 0 && <ClaimAmount rewards={rewards} onStartClaim={() => setStep(step + 1)} />}
      {step === 1 && <CommunityDistribution onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />}
      {step === 2 && (
        <ConfirmWallet
          rewards={rewards}
          onBack={() => setStep(step - 1)}
          onRedirect={() => handleRedirect()}
          library={library}
        />
      )}
    </div>
  )
}

export default function Home({ library, state, dispatch }) {

  const [rewards] = useState<IAirdropRewards>(getAirdropRewards(state.account.address.toLowerCase()))

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
