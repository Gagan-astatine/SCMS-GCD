import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useWarehouseMonitor from '../hooks/useWarehouseMonitor';
import supabase from '../config/SupabaseClient';

const Sidebar = () => {
  const { overflowing } = useWarehouseMonitor();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { to: "/orders", label: 'Orders' },
    { to: "/analytics", label: 'Analytics' },
    { to: "/map", label: 'Map View' },
    {
      to: "/warehouse",
      label: 'Warehouse',
      badge: overflowing.length > 0 ? `${overflowing.length} ⚠️` : null
    },
    { to: "/Fleet", label: 'Fleet' },
    { to: "/Dispatch", label: 'Dispatch' },
    { to: "/drivers", label: 'Drivers' },
    { to: "/ai-assistance", label: 'AI Assistance' },
    { to: "/settings", label: 'Settings' },
  ];

  return (
    <>
      <header className="top-navbar">
        {/* Left: Brand Name & Hamburger */}
        <div className="top-navbar-left">
          <button
            className="hamburger-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
          <div className="top-navbar-brand">
            <h2>IGNIS</h2>
          </div>
        </div>

        {/* Center: Desktop Nav Links */}
        <nav className="top-nav-links">
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.to}
              className={({ isActive }) => "top-nav-item" + (isActive ? " active" : "")}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span style={{
                  backgroundColor: '#f97316',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  marginLeft: '6px',
                  fontWeight: 'bold'
                }}>
                  {link.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="top-navbar-right">


          

          <div id="google_translate_element"></div>
          <button onClick={handleLogout} className="btn-logout-nav">
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div
        className={`mobile-drawer-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <nav className={`mobile-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        {navLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.to}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => "top-nav-item" + (isActive ? " active" : "")}
          >
            <span>{link.label}</span>
            {link.badge && (
              <span style={{
                backgroundColor: '#f97316',
                color: 'white',
                fontSize: '0.75rem',
                padding: '2px 8px',
                borderRadius: '12px',
                marginLeft: 'auto',
                fontWeight: 'bold'
              }}>
                {link.badge}
              </span>
            )}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          style={{
            margin: 'auto 24px 24px 24px',
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            padding: '12px 16px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: 'auto'
          }}
        >
          Logout
        </button>
      </nav>
    </>
  );
};

export default Sidebar;
