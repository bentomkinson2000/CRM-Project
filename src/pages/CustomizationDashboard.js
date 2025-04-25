// src/pages/CustomizationDashboard.js
import React, { useState } from 'react';
// Instead of @/components/ui/tabs, use a simpler approach
// import { Tabs, TabList, TabPanel, TabPanels, Tab } from '@/components/ui/tabs';
import { Sliders, Layout, Database, Palette, Users } from 'lucide-react';

const CustomizationDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Simplified tabs implementation
  const tabs = [
    { name: 'General Settings', icon: <Sliders size={18} /> },
    { name: 'Page Builder', icon: <Layout size={18} /> },
    { name: 'Custom Fields', icon: <Database size={18} /> },
    { name: 'Themes', icon: <Palette size={18} /> },
    { name: 'Roles & Permissions', icon: <Users size={18} /> }
  ];
  
  return (
    <div className="customization-dashboard">
      <div className="dashboard-header">
        <h1>Customize Your CRM</h1>
      </div>
      
      <div className="tabs">
        <div className="tab-list">
          {tabs.map((tab, index) => (
            <button 
              key={index}
              className={`tab-button ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
        
        <div className="tab-content">
          {activeTab === 0 && (
            <div>
              <h2>General Settings Content</h2>
              <p>General settings will be available soon.</p>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <h2>Page Builder Content</h2>
              <p>Page builder will be available soon.</p>
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <h2>Custom Fields Content</h2>
              <p>Custom fields will be available soon.</p>
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <h2>Themes Content</h2>
              <p>Theme settings will be available soon.</p>
            </div>
          )}
          {activeTab === 4 && (
            <div>
              <h2>Roles & Permissions Content</h2>
              <p>Role management will be available soon.</p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .customization-dashboard {
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }
        
        .dashboard-header {
          margin-bottom: 20px;
        }
        
        .tab-list {
          display: flex;
          border-bottom: 1px solid #dee2e6;
          margin-bottom: 20px;
        }
        
        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          cursor: pointer;
        }
        
        .tab-button.active {
          border-bottom-color: #4a6cf7;
          color: #4a6cf7;
        }
        
        .tab-content {
          padding: 16px;
        }
      `}</style>
    </div>
  );
};

export default CustomizationDashboard;