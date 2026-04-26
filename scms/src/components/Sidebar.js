import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SCMS</h2>
        <p>Logistics Control</p>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/orders" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Orders</span>
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Analytics</span>
        </NavLink>
        <NavLink to="/map" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Map View</span>
        </NavLink>
        <NavLink to="/vehicles" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Vehicles</span>
        </NavLink>
        <NavLink to="/warehouse" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>warehouse</span>
        </NavLink>
        <NavLink to="/Fleet" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Fleet</span>
        </NavLink>
        <NavLink to="/Dispatch" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Dispatch</span>
        </NavLink>
        <NavLink to="/drivers" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Drivers</span>
        </NavLink>
        <NavLink to="/AI assistance" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>AI assistance</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
          <div className="nav-icon"></div>
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
