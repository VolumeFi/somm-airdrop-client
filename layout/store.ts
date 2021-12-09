export const initState = {
  account: {},
  balance: 0,
  sommBalance: 0,
  received: false,
  deadline: 0,
  transactions: [],
  requests: {},
};

const LOCAL_KEY = 'somm-airdrop'

export function storage(type, ...args) {
  const [key, value] = args
  const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}')
  switch (type) {
    case 1: {
      local[key] = value
      return localStorage.setItem(LOCAL_KEY, JSON.stringify(local))
    }
    case 2: {
      return local[key]
    }
    case 3: {
      delete local[key]
      return localStorage.setItem(LOCAL_KEY, JSON.stringify(local))
    }
    default: {
      console.log('Out of tune!')
      break
    }
  }
}

export const setStorage = (...args) => storage(1, ...args)
export const getStorage = (...args) => storage(2, ...args)
export const delStorage = (...args) => storage(3, ...args)

export function reducer(state, action) {
  switch (action.type) {
    case 'account': {
      const [wallet] = action.payload
      const transactions =
        wallet.address && wallet.address === getStorage('account')
          ? getStorage('transactions')
          : []
      return {
        ...state,
        account: wallet,
        balance: 0,
        sommBalance: 0,
        received: false,
        deadline: 0,
      }
    }
    case 'balance':
      return { ...state, ...action.payload }
    case 'disconnect':
      return { ...state, account: '' }
    case 'txHash': {
      const [hash, success, ...args] = action.payload
      const hashes = typeof hash === 'string' ? [hash] : hash
      const transactions = success
        ? state.transactions.filter(([item]) => !hashes.includes(item))
        : [...state.transactions, [hash, ...args]]
      setStorage('transactions', transactions)
      if (success) {
        const [type, callback] = args
        delete state.requests[type]
        callback && callback()
      }
      return { ...state, transactions }
    }
    case 'txRequest': {
      const [type, request, id] = action.payload
      if (request) {
        return { ...state, requests: { ...state.requests, [type]: id } }
      } else {
        delete state.requests[type]
        return { ...state }
      }
    }
    default:
      console.log(`Unknown action - ${action.type}`)
      return state
  }
}
