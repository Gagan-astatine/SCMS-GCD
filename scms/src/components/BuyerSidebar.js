import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import supabase from '../config/SupabaseClient';

const BuyerSidebar = () => {
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { to: "/orders", label: t('navigation.my_purchases') },
    { to: "/buyer/invoices", label: t('navigation.invoices') },
    { to: "/map", label: t('navigation.tracking') },
    { to: "/payments", label: t('navigation.payments') },
    { to: "/settings", label: t('navigation.settings') }
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
          <button onClick={handleLogout} className="btn-logout-nav">
            {t('navigation.logout')}
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
          {t('navigation.logout')}
        </button>
      </nav>
    </>
  );
};

export default BuyerSidebar;
