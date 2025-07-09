import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// Components
import Navigation from './Navigation'
import Tabs from './Tabs'
import Swap from './Swap'
import Deposit from './Deposit'
import Withdraw from './Withdraw'
import Charts from './Charts'

import {
  loadAccount,
  loadNetwork,
  loadProvider,
  loadTokens,
  loadAMM,
} from '../store/interactions'

function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = loadProvider(dispatch)

    const chainId = await loadNetwork(provider, dispatch)

    window.ethereum.on('chainChanged', async (chainId) => {
      window.location.reload()
    })

    window.ethereum.on('accountsChanged', async (accounts) => {
      console.log('accounts', accounts)
      await loadAccount(dispatch)
    })

    // Initiate contracts
    await loadTokens(provider, chainId, dispatch)
    await loadAMM(provider, chainId, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <Container>
      <HashRouter>
        <Navigation />
        <hr />
        <Tabs />
        <Routes>
          <Route exact path='/' element={<Swap />} />
          <Route path='/deposit' element={<Deposit />} />
          <Route path='/withdraw' element={<Withdraw />} />
          <Route path='/charts' element={<Charts />} />
        </Routes>
      </HashRouter>
    </Container>
  )
}

export default App
