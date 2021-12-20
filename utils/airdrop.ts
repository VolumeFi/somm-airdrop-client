import BigNumber from "bignumber.js"

import SommRewards from "../token_rewards/somm_app_rewards.json"
import UniswapRewards from "../token_rewards/uniswap_v3_pool_rewards.json"
import OsmosisRewards from '../token_rewards/osmosis_pool_rewards.json'

export interface IAirdropRewards {
  sommPairingParticipation: BigNumber;
  sommPairingPositionWeighted: BigNumber;
  uniswapV3LP: BigNumber;
  total: BigNumber;
}

export const SOMM_PAIRING_PARTICIPATION_REWARDS: BigNumber = new BigNumber(
  3632
);

export const getAirdropRewards = (address: string): IAirdropRewards => {
  const rewards = {
    sommPairingParticipation: new BigNumber(0),
    sommPairingPositionWeighted: new BigNumber(0),
    uniswapV3LP: new BigNumber(0),
    total: new BigNumber(0),
  };

  if (address in SommRewards) {
    const sommRewards = new BigNumber(SommRewards[address]);
    if (sommRewards.comparedTo(SOMM_PAIRING_PARTICIPATION_REWARDS) >= 0) {
      rewards.sommPairingParticipation = SOMM_PAIRING_PARTICIPATION_REWARDS;
      rewards.sommPairingPositionWeighted = sommRewards.minus(
        SOMM_PAIRING_PARTICIPATION_REWARDS
      );
    } else {
      rewards.sommPairingParticipation = sommRewards;
    }
  }

  if (address in UniswapRewards) {
    rewards.uniswapV3LP = new BigNumber(UniswapRewards[address]);
  }

  rewards.total = rewards.sommPairingParticipation
    .plus(rewards.sommPairingPositionWeighted)
    .plus(rewards.uniswapV3LP);

  return rewards;
};

export const getOsmosisRewards = (address: string): BigNumber => {
  if (address in OsmosisRewards) {
    return new BigNumber(OsmosisRewards[address])
  }

  return new BigNumber(0)
}

export const sortRewardsData = () => {
  const allRewards = {};

  // Merge 2 jsons
  Object.keys(SommRewards).forEach((item) => {
    if (item in allRewards) {
      allRewards[item] = allRewards[item].plus(
        new BigNumber(SommRewards[item]).multipliedBy(
          new BigNumber(Math.pow(10, 18))
        )
      );
    } else {
      allRewards[item] = new BigNumber(SommRewards[item]).multipliedBy(
        new BigNumber(Math.pow(10, 18))
      );
    }
  });

  Object.keys(UniswapRewards).forEach((item) => {
    if (item in allRewards) {
      allRewards[item] = allRewards[item].plus(
        new BigNumber(UniswapRewards[item]).multipliedBy(
          new BigNumber(Math.pow(10, 18))
        )
      );
    } else {
      allRewards[item] = new BigNumber(UniswapRewards[item]).multipliedBy(
        new BigNumber(Math.pow(10, 18))
      )
    }
  });

  // Convert merged json to array
  const rewardArr = [];

  Object.keys(allRewards).forEach((item) => {
    rewardArr.push({
      address: item,
      amount: allRewards[item].toString(10)
    })
  })

  // sort
  rewardArr.sort((a, b) => {
    if (a.address > b.address) {
      return 1
    } 
    return -1
  })

  // re-make dict object
  const sorted = {}
  for (let i = 0; i < rewardArr.length; i++) {
    sorted[rewardArr[i].address] = rewardArr[i].amount
  }

  return sorted
};
