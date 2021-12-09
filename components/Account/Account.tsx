import React, { useState } from 'react'
import { TMap } from 'types'
import Button from 'components/Button/Button'
import styles from './Account.module.css'
import { accountBalance } from 'layout'

// import Gravatar from 'react-gravatar'

interface IAccount {
  caption?: string
  library: any
  transactions: any
  requests: any
  loading: boolean
  account: TMap
  balance: string
  rewardBalance: string
  dispatch: Function
  connectWallet: Function
}

export default function Account({
  caption,
  dispatch,
  library,
  transactions,
  requests,
  loading = false,
  account,
  balance,
  connectWallet,
}: IAccount) {
  const [isClicked, setIsClicked] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const transactionMap = transactions.reduce(
    ([claim], [hash, type, ...args]) => {
      const transaction = {
        claim: {},
      }
      switch (type) {
        case 'claim':
          transaction.claim[args[0]] = hash
          break
        default:
          break
      }
      return [{ ...claim, ...transaction.claim }]
    },
    new Array(1).fill({})
  )

  const handleTransaction =
    (type, ...args) =>
    (transaction, callback = () => {}) => {
      dispatch({
        type: 'txRequest',
        payload: [type, true, ...args],
      })
      transaction
        .on('transactionHash', function (hash) {
          dispatch({
            type: 'txHash',
            payload: [hash, false, type, ...args],
          })
        })
        .on('receipt', function (receipt) {
          dispatch({
            type: 'txHash',
            payload: [receipt.transactionHash, true, type, callback()],
          })
          accountBalance(library, dispatch)
        })
        .on('error', (err, receipt) => {
          if (receipt) {
            dispatch({
              type: 'txHash',
              payload: [receipt.transactionHash, true, type],
            })
          } else {
            dispatch({
              type: 'txRequest',
              payload: [type, false, ...args],
            })
          }
        })
    }

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
