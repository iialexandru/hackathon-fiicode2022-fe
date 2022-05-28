import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

import '../styles/scss/globals.scss'
import { AuthProvider } from '../utils/useAuth'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'

const Sidebar = dynamic(() => import('../components/Layout/Sidebar'), {
  ssr: false
})

function MyApp({ Component, pageProps }: AppProps) {
  const [ showSD, setShowSD ] = useState(false)
  const [ showHeader, setShowHeader ] = useState(false)
  const router = useRouter()
  const [ showSDMQ, setShowSDMQ ] = useState(true)
  const [ activateMenu, setActivateMenu ] = useState(false)

  useEffect(() => {
    if(router.pathname !== '/authentication/login' && router.pathname !== '/authentication/register' && router.pathname !== '/authentication/forgot-password' && router.pathname !== '/authentication/forgot-password/[token]' && router.pathname !== '/child-request' && router.pathname !== '/child-request/decide/[qr]' && router.pathname !== '/child-dashboard') {
      setShowSD(true)
    }
    if(router.pathname !== '/authentication/login' && router.pathname !== '/authentication/register' && router.pathname !== '/authentication/forgot-password' ) {
      setShowHeader(true)
    }
  }, [router.pathname])


  return (
    <AuthProvider>
      <Head>
        <title>Child Track</title>
        <meta name="description" content="O aplicatie pentru administrarea noilor idei oferite de catre oameni dintr-o anumita comuna/localitate/judet pentru imbunatatirea acesteia" />
        <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1" />
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://romdig.net" />
        <link rel="logo icon" href="/favicon.ico" />
      </Head>
      {!showHeader ? <></> : <Header showSDMQ={showSDMQ} setActivateMenu={setActivateMenu} activateMenu={activateMenu} show={showSD} /> }
      {(!showSD) ? <></> : <Sidebar activateMenu={activateMenu} /> }
      <Component {...pageProps} />
      <Footer />
    </AuthProvider>
  )
}

export default MyApp
