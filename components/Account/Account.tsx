import React, { useState } from 'react'
import { TMap } from 'types'
import Button from 'components/Button/Button'
import styles from './Account.module.css'
import { accountBalance } from 'layout'

// import Gravatar from 'react-gravatar'

interface IAccount {
  caption?: string
  library: any
  loading: boolean
  account: TMap
  balance: string
  dispatch: Function
  connectWallet: Function
}

export default function Account({
  caption,
  dispatch,
  library,
  loading = false,
  account,
  balance,
  connectWallet,
}: IAccount) {
  const [isClicked, setIsClicked] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.account}>
      {!account.address ? (
        <Button
          className={`cursor ${styles.connectBtn}`}
          onClick={() => {
            setIsClicked(true)
            connectWallet(true)
          }}
        >
          {caption ? caption : 'Connect'}
        </Button>
      ) : (
        <div className={styles.info}>
          {!loading && (
            <div className="flex-center cursor">
              {`${account.address.substring(0, 7)}....${account.address.substring(account.address.length - 4)}`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
