// components/Sidebar.js - Updated with customization options
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  FileText, 
  ShoppingCart, 
  Package, 
  Briefcase,
  Settings,
  Database,
  Layout
} from 'lucide-react';
import { useConfiguration } from '../context/ConfigurationContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { config, loading } = useConfiguration();

  // Apply theme from configuration
  const sidebarStyle = !loading && config?.theme 
    ? { backgroundColor: config.theme.sidebar } 
    : {};
  
  const textStyle = !loading && config?.theme 
    ? { color: config.theme.sidebar === '#ffffff' ? '#333333' : '#a6b0cf' } 
    : {};

  return (
    <div className="sidebar" style={sidebarStyle}>
      <div className="logo">
        <h2 style={textStyle}>
          {!loading && config?.general?.companyName 
            ? config.general.companyName 
            : 'CRM System'
          }
        </h2>
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
        
        {/* Customization Section */}
        <div className="sidebar-section">
          <div className="sidebar-section-title" style={textStyle}>Customization</div>
          <NavLink to="/customize" className={({ isActive }) => isActive ? 'active' : ''} end>
            <Settings size={20} />
            <span>Customize CRM</span>
          </NavLink>
          <NavLink to="/customize/fields" className={({ isActive }) => isActive ? 'active' : ''}>
            <Database size={20} />
            <span>Custom Fields</span>
          </NavLink>
          <NavLink to="/customize/pages/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
            <Layout size={20} />
            <span>Page Builder</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;