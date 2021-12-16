import React, { useReducer, useState } from 'react'
import BigNumber from 'bignumber.js'
import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useWallet from 'hooks/useWallet'
import Account from 'components/Account/Account'
import { toNumber } from 'utils/common'
import { addresses, ZERO } from 'utils/constants'
import { reducer, initState } from './store'

import styles from './Layout.module.css'

const FETCH_TIME = 15
let balanceTimer = null

const networkLabels = {
  1: 'Ethereum Network',
  4: 'Rinkeby Testnet',
  3: 'Ropsten Testnet',
  5: 'Goreli Testnet',
  42: 'Kovan Testnet',
  56: 'Binance Network',
  97: 'Binance Testnet',
}

export function accountBalance(library, dispatch) {
  if (!library || !library.initiated) return
  const account = library.wallet.address
  const fromWei = (value, decimals = 18) =>
    decimals < 18
      ? new BigNumber(value).div(10 ** decimals).toFixed(decimals, 0)
      : library.web3.utils.fromWei(value)
  if (!addresses[library.wallet.network]) {
    return
  }
  Promise.all([
    library.web3.eth.getBalance(account),
    library.methods.SommToken.getBalance(account),
    // library.methods.Airdrop.received(account),
    // library.methods.Airdrop.deadline(),
  ])
    .then(
      ([
        _balance,
        _sommBalance,
        // _received,
        // _deadline,
      ]) => {
        const balance = toNumber(fromWei(_balance))
        const sommBalance = toNumber(fromWei(_sommBalance))
        // const airdropReceived = _received
        // const deadline = _deadline

        dispatch({
          type: 'balance',
          payload: {
            balance,
            sommBalance,
          },
        })
      }
    )
    .catch(console.log)
}

export default function Layout({
  children,
  router: { route },
  networks,
}) {
  const [state, dispatch] = useReducer(reducer, initState)
  const [loading, connectWallet, library] = useWallet(dispatch)
  const [restored, setRestored] = useState(false)

  const getBalance = () => {
    accountBalance(library, dispatch)
  }

  useEffect(() => {
    if (library && state.account.address) {
      if (balanceTimer) clearInterval(balanceTimer)
      balanceTimer = setInterval(getBalance, FETCH_TIME * 1000)
      getBalance()
    }
    return () => balanceTimer && clearInterval(balanceTimer)
  }, [library, state.account.address])

  const checkTransactions = () => {
    const { transactions } = state
    Promise.all(
      transactions.map(
        (transaction) =>
          new Promise((resolve) => {
            library.web3.eth
              .getTransactionReceipt(transaction[0])
              .then(() => resolve(transaction[0]))
              .catch(() => resolve(transaction[0]))
          })
      )
    ).then((receipts) => {
      dispatch({
        type: 'txHash',
        payload: [receipts.filter((hash) => hash), true],
      })
    })
  }

  useEffect(() => {
    if (!restored && library) {
      setRestored(true)
      checkTransactions()
    }
  }, [library, state.transactions, state.account.address])

  return (
    <>
      <Head>
        <title>Sommelier Airdrop</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <link
          href="https://necolas.github.io/normalize.css/latest/normalize.css"
          rel="stylesheet"
          type="text/css"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={`${styles.main} flex-column justify-between`}>
        <header className={styles.header}>
          {state.account.address && (
            <img src="/logo.png" className={styles.headerLogo} />
          )}
          <div className={styles.headerConnect}>
            <Account
              library={library}
              {...state}
              loading={loading}
              dispatch={dispatch}
              connectWallet={connectWallet}
            />
          </div>
        </header>
        {!state.account.address && (
          <div className={styles.noAccountContainer}>
            <img src="/assets/landing-logo-1.png" className={styles.noAcountBg} />
            <div className={styles.noAccountLanding}>
              <div className={styles.noAccountLandingLogo}>
                <img src="/assets/sommelier.png" />
              </div>
              <span>Introducing SOMM</span>
              <h1>Sommelier Airdrop</h1>
              <Account
                caption={<div className={styles.noAccountConnect}>Connect to Wallet<img src="/assets/right-arrow.png" /></div>}
                library={library}
                {...state}
                loading={loading}
                dispatch={dispatch}
                connectWallet={connectWallet}
              />
            </div>
          </div>
        )}
        {state.account.address && (
          <>
            {(networks.includes(state.account.network && library)) ?
              React.cloneElement(children, {
                state,
                dispatch,
                library,
                networks,
              }) : (
                <div className={styles.noAccountContainer}>
                  <img src="/assets/landing-logo-1.png" className={styles.noAcountBg} />
                  <div className={styles.noAccountLanding}>
                    Please connect to following networks
                <br />
                    <ul>
                      {networks.map((network, idx) => (
                        <li key={idx}>{networkLabels[network]}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            }
          </>
        )}
      </main>
    </>
  )
}
