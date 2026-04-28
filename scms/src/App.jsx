import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import supabase from "./config/SupabaseClient";
import "./App.css";

import Home from "./pages/home";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import BuyerDashboard from "./pages/BuyerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import Payment from "./pages/payment";

import Sidebar from "./components/Sidebar";
import BuyerSidebar from "./components/BuyerSidebar";
import DriverSidebar from "./components/DriverSidebar";
import WarehousePage from "./pages/WarehousePage"
import AnalyticsPage from "./pages/AnalyticsPage";
import AIAssistancePage from "./pages/AIAssistancePage";

import Fleet from "./pages/fleet"
import Dispatch from "./pages/dispatch"
import Driver from "./pages/drivers"
import MapView from "./pages/mapview"
import "leaflet/dist/leaflet.css"
import useWarehouseMonitor from "./hooks/useWarehouseMonitor";
import WarehouseAlertBanner from "./components/WarehouseAlertBanner";




function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  useWarehouseMonitor();

  // ✅ Get session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ✅ Fetch role from profiles table
  useEffect(() => {
    if (session?.user) {
      supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error("Error fetching role:", error);
          } else {
            setRole(data.role);
          }
        });
    }
  }, [session]);

  // ✅ Loading states
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (session && !role) {
    return <div className="loading-screen">Loading role...</div>;
  }

  // ✅ Layout rendering
  const renderLayout = () => {
    // 🟢 BUYER
    if (role === "buyer") {
      return (
        <div className="app-layout">
          <BuyerSidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<BuyerDashboard />} />
              <Route path="/payments" element={<Payment />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      );
    }

    // 🚚 DRIVER
    if (role === "driver") {
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
      );
    }

    // 🏪 OWNER / SELLER (default)
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/warehouse" element={<WarehousePage />} />
            <Route path="/Fleet" element={<Fleet />} />
            <Route path="/Dispatch" element={<Dispatch />} />
            <Route path="/drivers" element={<Driver />} />
            <Route path="/ai-assistance" element={<AIAssistancePage />} />
            <Route path="/map" element={<MapView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    );
  };

  return (
    <BrowserRouter>
      {session ? (
        <>
          <WarehouseAlertBanner />
          {renderLayout()}
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
      )}
    </BrowserRouter>
  );

}

export default App;