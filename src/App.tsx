import { HashRouter, MemoryRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Toast } from './components/ui'
import { AppStateProvider } from './state/AppState'
import Compare from './screens/Compare'
import FarmerHome from './screens/FarmerHome'
import GroupSell from './screens/GroupSell'
import KrishiMitra from './screens/KrishiMitra'
import MandiDetail from './screens/MandiDetail'
import OfficerDashboard from './screens/OfficerDashboard'
import Prices from './screens/Prices'
import Schemes from './screens/Schemes'
import Sell, { SellDone } from './screens/Sell'
import Welcome from './screens/Welcome'
import { useApp } from './state/AppState'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function LangAttr() {
  const { lang } = useApp()
  useEffect(() => {
    document.documentElement.lang = lang === 'mr' ? 'mr' : 'en'
  }, [lang])
  return null
}

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

// The single-file build (npm run build:single) keeps routes in memory, for hosts that own the URL hash.
const Router = import.meta.env.VITE_MEMORY_ROUTER === '1' ? MemoryRouter : HashRouter

export default function App() {
  return (
    <AppStateProvider>
      <Router>
        <LangAttr />
        <ScrollTop />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/farmer" element={<FarmerHome />} />
          <Route path="/farmer/prices" element={<Prices />} />
          <Route path="/farmer/mandi/:id" element={<MandiDetail />} />
          <Route path="/farmer/compare" element={<Compare />} />
          <Route path="/farmer/sell" element={<Sell />} />
          <Route path="/farmer/sell/done" element={<SellDone />} />
          <Route path="/farmer/group" element={<GroupSell />} />
          <Route path="/farmer/schemes" element={<Schemes />} />
          <Route path="/mitra" element={<KrishiMitra />} />
          <Route path="/officer" element={<OfficerDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </Router>
    </AppStateProvider>
  )
}
