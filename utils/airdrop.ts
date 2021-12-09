import BigNumber from "bignumber.js";

import SommRewards from '../token_rewards/somm_app_rewards.json'
import UniswapRewards from '../token_rewards/uniswap_v3_pool_rewards.json'

export interface IAirdropRewards {
  sommPairingParticipation: BigNumber;
  sommPairingPositionWeighted: BigNumber;
  uniswapV3LP: BigNumber;
  total: BigNumber;
}

export const SOMM_PAIRING_PARTICIPATION_REWARDS: BigNumber = new BigNumber(3632)

export const getAirdropRewards = (address: string): IAirdropRewards => {

  const rewards = {
    sommPairingParticipation: new BigNumber(0),
    sommPairingPositionWeighted: new BigNumber(0),
    uniswapV3LP: new BigNumber(0),
    total: new BigNumber(0),
  }

  if (address in SommRewards) {
    const sommRewards = new BigNumber(SommRewards[address])
    if (sommRewards.comparedTo(SOMM_PAIRING_PARTICIPATION_REWARDS) >= 0) {
      rewards.sommPairingParticipation = SOMM_PAIRING_PARTICIPATION_REWARDS
      rewards.sommPairingPositionWeighted = sommRewards.minus(SOMM_PAIRING_PARTICIPATION_REWARDS)
    } else {
      rewards.sommPairingParticipation = sommRewards
    }
  }

  if (address in UniswapRewards) {
    rewards.uniswapV3LP = new BigNumber(UniswapRewards[address])
  }

  rewards.total = rewards.sommPairingParticipation.plus(rewards.sommPairingPositionWeighted).plus(rewards.uniswapV3LP)
  
  return rewards;
}
