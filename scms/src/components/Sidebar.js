import React from 'react';
import { NavLink } from 'react-router-dom';
import useWarehouseMonitor from '../hooks/useWarehouseMonitor';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Sidebar = () => {
  const { overflowing } = useWarehouseMonitor();
  const { t } = useTranslation();

  return (
    <div className="sidebar">
      <div className="sidebar-header" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h2>SCMS</h2>
          <p>Logistics Control</p>
        </div>
        {/* Language Switcher added to the top left of the sidebar */}
        <div style={{ width: '100%' }}>
          <LanguageSwitcher placement="top" />
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/orders" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.orders', 'Orders')}</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.analytics', 'Analytics')}</span>
        </NavLink>
        <NavLink to="/map" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.map_view', 'Map View')}</span>
        </NavLink>
        <NavLink to="/warehouse" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.warehouse', 'Warehouse')}</span>
          {overflowing.length > 0 && (
            <span style={{ 
              backgroundColor: '#ef4444', 
              color: 'white', 
              fontSize: '0.75rem', 
              padding: '2px 8px', 
              borderRadius: '12px', 
              marginLeft: 'auto',
              fontWeight: 'bold'
            }}>
              {overflowing.length} ⚠️
            </span>
          )}
        </NavLink>
        <NavLink to="/Fleet" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.fleet', 'Fleet')}</span>
        </NavLink>
        <NavLink to="/Dispatch" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.dispatch', 'Dispatch')}</span>
        </NavLink>
        <NavLink to="/drivers" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.drivers', 'Drivers')}</span>
        </NavLink>
        <NavLink to="/ai-assistance" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.ai_assistance', 'AI Assistance')}</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>{t('navigation.settings', 'Settings')}</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
