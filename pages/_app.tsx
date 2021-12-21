import { AppProps } from 'next/app'
import Layout from 'layout'
import 'styles/globals.css'

// import 'vendor/home.scss'

const allowedNetworks = [4]

function App({ Component, router }: AppProps) {
  return (
    <Layout router={router} networks={allowedNetworks}>
      <Component />
    </Layout>
  )
}

export default App
