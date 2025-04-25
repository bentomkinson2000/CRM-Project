// components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, FileText, ShoppingCart, Package, Briefcase } from 'lucide-react';
import '../styles/Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h2>CRM System</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => isActive ? 'active' : ''}>
          <Users size={20} />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/quotes" className={({ isActive }) => isActive ? 'active' : ''}>
          <FileText size={20} />
          <span>Quotes</span>
        </NavLink>
        <NavLink to="/sales-orders" className={({ isActive }) => isActive ? 'active' : ''}>
          <ShoppingCart size={20} />
          <span>Sales Orders</span>
        </NavLink>
        <NavLink to="/invoices" className={({ isActive }) => isActive ? 'active' : ''}>
          <FileText size={20} />
          <span>Invoices</span>
        </NavLink>
        <NavLink to="/purchase-orders" className={({ isActive }) => isActive ? 'active' : ''}>
          <Package size={20} />
          <span>Purchase Orders</span>
        </NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? 'active' : ''}>
          <Briefcase size={20} />
          <span>Projects</span>
        </NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
          <Package size={20} />
          <span>Products</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;