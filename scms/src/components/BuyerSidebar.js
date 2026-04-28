import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import supabase from '../config/SupabaseClient';
import GoogleTranslate from './GoogleTranslate';

const BuyerSidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { to: "/orders", label: 'My Purchases' },
    { to: "/buyer/invoices", label: 'Invoices' },
    { to: "/map", label: 'Tracking' },
    { to: "/payments", label: 'Payments' },
    { to: "/settings", label: 'Settings' }
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
            </NavLink>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="top-navbar-right">
          <GoogleTranslate />
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

export default BuyerSidebar;
