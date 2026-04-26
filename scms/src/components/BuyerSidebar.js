import React from 'react';
import { NavLink } from 'react-router-dom';

const BuyerSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Buyer Portal</h2>
        <p>Purchasing Control</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/buyer/purchases" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>My Purchases</span>
        </NavLink>
        <NavLink to="/buyer/invoices" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Invoices</span>
        </NavLink>
        <NavLink to="/buyer/tracking" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Tracking</span>
        </NavLink>
        <NavLink to="/buyer/payments" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Payments</span>
        </NavLink>
        <NavLink to="/buyer/settings" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default BuyerSidebar;
