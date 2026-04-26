import React from 'react';
import { NavLink } from 'react-router-dom';

const DriverSidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Driver Portal</h2>
        <p>Delivery Routes</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/driver/assigned-loads" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Assigned Loads</span>
        </NavLink>
        <NavLink to="/driver/route-map" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Route Map</span>
        </NavLink>
        <NavLink to="/driver/earnings" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Earnings</span>
        </NavLink>
        <NavLink to="/driver/settings" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default DriverSidebar;
