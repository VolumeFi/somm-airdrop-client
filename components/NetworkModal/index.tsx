import React from 'react'
import Link from 'next/link'

import { TMap } from 'types'
import Account from 'components/Account/Account'

import styles from './NetworkModal.module.css'

const NetworkModal = ({
  onClose,
  onSelectNetwork,
}: {
  onClose: () => void;
  onSelectNetwork: (network: string) => void;
}) => (
  <>
    <div className={styles.modalMask} />
    <div className={styles.modalContainer} onClick={(e) => onClose()}>
      <div className={styles.modalPanel} onClick={(e) => {e.stopPropagation()}}>
        <span className={styles.title}>Choose a Blockchain</span>
        <div className={styles.content}>
          <div className={styles.network} onClick={(e) => onSelectNetwork('ethereum')}>
            <img src='/assets/ethereum.png' />
            <h3>Ethereum</h3>
          </div>
          <div className={styles.divider} />
          <div className={styles.network} onClick={(e) => onSelectNetwork('osmosis')}>
            <Link href="/osmosis">
              <div>
                <img src='/assets/osmosis.png' />
                <h3>Osmosis</h3>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
)

export default NetworkModal
