import { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from 'layout'
import 'styles/globals.css'
import 'styles/sassStyles/_global.scss'

import { useEffect, useState } from 'react'

import 'vendor/index.scss'
import 'vendor/home.scss'

function App({ Component, router }: AppProps) {
  return (
    <Layout router={router} networks={[1, 4]}>
      <Component />
    </Layout>
  )
}

export default App
