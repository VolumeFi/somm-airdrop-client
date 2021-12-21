import React, { useState } from 'react'
import { TMap } from 'types'
import Button from 'components/Button/Button'
import styles from './Account.module.css'

import { usePopperTooltip } from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';
import { toUnicode } from 'punycode';

// import Gravatar from 'react-gravatar'

interface IAccount {
  caption?: string
  library: any
  loading: boolean
  account: TMap
  balance: string
  dispatch: Function
  connectWallet: Function
  disconnectWallet: Function
}

export default function Account({
  caption,
  dispatch,
  library,
  loading = false,
  account,
  balance,
  connectWallet,
  disconnectWallet
}: IAccount) {

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    closeOnOutsideClick: true,
    offset: [0, 25],
    trigger: 'click',
    interactive: true,
  });

  const handleDisconnect = () => {
    disconnectWallet()
  }

  return (
    <div className={styles.account}>
      {!account.address ? (
        <Button
          className={`cursor ${styles.connectBtn}`}
          onClick={() => {
            connectWallet(true)
          }}
        >
          {caption ? caption : 'Connect'}
        </Button>
      ) : (
        <div className={styles.info}>
          {!loading && (
            <div className="flex-center cursor" ref={setTriggerRef}>
              {`${account.address.substring(0, 7)}....${account.address.substring(account.address.length - 4)}`}
              {visible && (
                <div
                  role="button"
                  ref={setTooltipRef}
                  {...getTooltipProps({ className: 'tooltip-container' })}
                >
                  <div className={styles.tooltip}>
                    <div {...getArrowProps({ className: 'tooltip-arrow' })} />
                    <div className={styles.address}>
                      <span>Connected</span>: {`${account.address.substring(0, 16)}...`}
                    </div>
                    <div className={styles.disconnect}>
                      <Button onClick={(e) => handleDisconnect()} >Disconnect</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
