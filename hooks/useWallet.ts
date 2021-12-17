import { useEffect, useState } from 'react'
import Web3Modal from 'web3modal'
import WalletConnectProvider from '@walletconnect/web3-provider'
import SommAirdropLibrary from "lib/index";
import { addresses } from 'utils/constants'

let web3Modal

type TWallet = [boolean, Function, any, Function]

const events = []

export default function useWallet(dispatch) {
  const [library, setLibrary] = useState(null)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "c26be770c99b41e6a479882b309f75bf", // Required
        },
      },
    };
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    })
  }, [])

  const handleEvent = (event) => {
    switch (event.event) {
      case 'WALLET': {
        if (event.status === 3) {
          dispatch({ type: 'disconnect' })
        } else {
          if (event.status !== 0) {
            dispatch({ type: 'account', payload: event.data })
          }
        }
        break
      }
      default: {
        if (event.event && events.includes(event.event)) {
          console.log(event)
        }
        break
      }
    }
  }

  const initLibrary = (provider) => {
    if (library) {
      library.setProvider(provider)
    } else {
      setLibrary(
        new SommAirdropLibrary(provider, {
          onEvent: handleEvent,
          addresses,
        })
      );
    }
  }

  async function getProvider(refresh) {
    if (refresh && web3Modal) {
      web3Modal.clearCachedProvider()
    }
    try {
      setLoading(true)
      const provider = await web3Modal.connect()
      setLoading(false)
      return provider
    } catch (e) {
      setLoading(false)
      return null
    }
  }

  function connectWallet(refresh = false) {
    getProvider(refresh).then((provider) => {
      if (provider) initLibrary(provider)
    })
  }

  function disconnectWallet() {
     dispatch({ type: "disconnect" });
  }

  const ret: TWallet = [loading, connectWallet, library, disconnectWallet]
  return ret
}
