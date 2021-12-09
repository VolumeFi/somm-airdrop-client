import { ApolloClient, InMemoryCache, gql  } from '@apollo/client';
import BigNumber from 'bignumber.js';

// NOTE: This supports only mainnet uniswap data fetching
export const graphClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  // fetchOptions: {
  //   mode: 'no-cors'
  // },
  cache: new InMemoryCache()
});


function setCacheValue(key, value) {
  if (localStorage !== undefined) {
    localStorage.setItem(key, value)
  }
}

function getCacheValue(key, defaultValue = '0') {
  if (localStorage !== undefined) {
    return localStorage.getItem(key) || defaultValue
  }
  return defaultValue
}
