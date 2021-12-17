import { useState, useEffect, useMemo } from 'react'

import { IAirdropRewards, getAirdropRewards, sortRewardsData } from '../utils/airdrop'
import { getOnlyDigitalValue, getOnlyPointsValue } from '../utils/number'
import { makeMerkleTree, getMerkleProof } from '../utils/merkletree'

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
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<number>(0)   // wizard view

  const [received, setReceived] = useState<number>(0)  // already claimed ? 0: not loaded 1: received 2: not received
  const [transactionStatus, setTransactionStatus] = useState<boolean>(false)

  useEffect(() => {
    const receivedClaim = async () => {
      if (library?.wallet?.address) {
        const receivedStatus = await library.methods.Airdrop.received(library.wallet.address)
        setReceived(receivedStatus === true ? 1 : 2);
      }
    }
    receivedClaim();
  }, [library?.wallet?.address])

  const handleClaim = async () => {
    setLoading(true)

    const proof = getMerkleProof(library.wallet.address)

    const transaction = library.methods.Airdrop.claim(
      library.wallet.address,
      new BigNumber(proof.amount),
      proof.proof,
      { from: library.wallet.address }
    )

    try {
      await transaction.send()

      const receivedStatus = await library.methods.Airdrop.received(library.wallet.address);

      if (receivedStatus) {
        setTransactionStatus(true)
      }

      setReceived(receivedStatus === true ? 1 : 2)

    } catch (e) {
      setLoading(false)
    }

    setLoading(false)
  }

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
      {(step === 2 && received !== 0) && (
        <ConfirmWallet
          loading={loading}
          received={received}
          transactionStatus={transactionStatus}
          rewards={rewards}
          onBack={() => setStep(step - 1)}
          onClaim={() => handleClaim()}
          onRedirect={() => handleRedirect()}
        />
      )}
    </div>
  )
}

export default function Home({ library, state, dispatch }) {

  const [rewards, setRewards] = useState<IAirdropRewards>(getAirdropRewards(state.account.address.toLowerCase()))

   // if (received) {
  //   return (
  //     <div className='container container-center'>
  //       <AlreadyClaimed />
  //     </div>
  //   )
  // }

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
