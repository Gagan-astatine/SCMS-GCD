import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useWarehouseMonitor from '../hooks/useWarehouseMonitor';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import supabase from '../config/SupabaseClient';

const Sidebar = () => {
  const { overflowing } = useWarehouseMonitor();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { to: "/orders", label: t('navigation.orders', 'Orders') },
    { to: "/analytics", label: t('navigation.analytics', 'Analytics') },
    { to: "/map", label: t('navigation.map_view', 'Map View') },
    {
      to: "/warehouse",
      label: t('navigation.warehouse', 'Warehouse'),
      badge: overflowing.length > 0 ? `${overflowing.length} ⚠️` : null
    },
    { to: "/Fleet", label: t('navigation.fleet', 'Fleet') },
    { to: "/Dispatch", label: t('navigation.dispatch', 'Dispatch') },
    { to: "/drivers", label: t('navigation.drivers', 'Drivers') },
    { to: "/ai-assistance", label: t('navigation.ai_assistance', 'AI Assistance') },
    { to: "/settings", label: t('navigation.settings', 'Settings') },
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


          <div className="language-switcher-container" style={{ width: '160px' }}>
            <LanguageSwitcher placement="bottom" />
          </div>

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
      </nav>
    </>
  );
};

export default Sidebar;
