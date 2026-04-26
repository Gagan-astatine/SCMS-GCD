import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from './config/SupabaseClient'
import './App.css';
import Home from "./pages/home"
import Auth from "./pages/Auth"
import Orders from "./pages/Orders"
import BuyerDashboard from "./pages/BuyerDashboard"
import DriverDashboard from "./pages/DriverDashboard"

import Sidebar from "./components/Sidebar"
import BuyerSidebar from "./components/BuyerSidebar"
import DriverSidebar from "./components/DriverSidebar"

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  const role = session?.user?.user_metadata?.role || 'seller'

  const renderLayout = () => {
    if (role === 'buyer') {
      return (
        <div className="app-layout">
          <BuyerSidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<BuyerDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      )
    }

    if (role === 'driver') {
      return (
        <div className="app-layout">
          <DriverSidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<DriverDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      )
    }

    // Default to Seller
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    )
  }

  return (
    <BrowserRouter>
      {session ? (
        renderLayout()
      ) : (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
