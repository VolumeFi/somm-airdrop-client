import React from 'react'

import styles from 'styles/Airdrop.module.css'

const RewardsItem = ({
  text,
  value,
 }: {
   text: string;
   value: string;
 }) => {
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

export default RewardsItem
