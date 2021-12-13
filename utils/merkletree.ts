import { sortRewardsData } from "./airdrop"
import { MerkleTree } from "merkletreejs"
import web3 from "web3"

import keccak256 from "keccak256";

const blankHash =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

const makeHashList = () => {
  const hashList = []

  const rewards = sortRewardsData()

  Object.keys(rewards).forEach((item) => {
    const hash = web3.utils.soliditySha3(
      {
        type: "address",
        value: web3.utils.toChecksumAddress(item),
      },
      {
        type: "uint256",
        value: rewards[item],
      }
    );

    hashList.push(hash)
  });

  return hashList
}

export const makeMerkleTree = () => {
  
  const hashList = makeHashList()
  const merkleTree = new MerkleTree(hashList, keccak256, { sortPairs: true })

  return merkleTree
}

export const getMerkleRoot = () => {
  const tree = makeMerkleTree()

  return tree.getHexRoot()
}

export const getMerkleProof = (address) => {

  // var address = "0xffffe6c261fac5ea28c41e71672b482efbad8e4b";

  const tree = makeMerkleTree()

  const rewards = sortRewardsData()

  const amount = rewards[address.toLowerCase()]

  const leaf = web3.utils.soliditySha3(
    {
      type: "address",
      value: web3.utils.toChecksumAddress(address),
    },
    {
      type: "uint256",
      value: amount,
    }
  )

  const proof = tree.getHexProof(leaf)

  if (proof.length < 15) {
    for (let i = proof.length; i < 15; i++) {
      proof.push(blankHash)
    }
  }

  return {
    amount,
    proof
  }
}
