import { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from 'layout'
import 'styles/globals.css'
import 'styles/sassStyles/_global.scss'

import { useEffect, useState } from 'react'

import 'vendor/index.scss'
import 'vendor/home.scss'

const allowedNetworks = [4]

function App({ Component, router }: AppProps) {
  return (
    <Layout router={router} networks={allowedNetworks}>
      <Component />
    </Layout>
  )
}

export default App
