// src/context/ConfigurationContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const ConfigurationContext = createContext();

// Custom hook for using the configuration context
export const useConfiguration = () => {
  const context = useContext(ConfigurationContext);
  if (!context) {
    throw new Error('useConfiguration must be used within a ConfigurationProvider');
  }
  return context;
};

// Provider component
export const ConfigurationProvider = ({ children }) => {
  const [config, setConfig] = useState({
    general: {
      companyName: 'CRM System',
      currency: 'USD',
      dateFormat: 'MM/DD/YYYY'
    },
    customFields: [],
    theme: {
      primary: '#4a6cf7',
      secondary: '#6c757d',
      sidebar: '#2a3042'
    }
  });
  const [loading, setLoading] = useState(false);

  // The context value
  const contextValue = {
    config,
    loading,
    updateConfigSection: () => console.log('Update config not implemented yet'),
    addCustomField: () => console.log('Add custom field not implemented yet'),
    updateCustomField: () => console.log('Update custom field not implemented yet'),
    deleteCustomField: () => console.log('Delete custom field not implemented yet'),
    updateTheme: () => console.log('Update theme not implemented yet'),
    updateLayout: () => console.log('Update layout not implemented yet')
  };

  return (
    <ConfigurationContext.Provider value={contextValue}>
      {children}
    </ConfigurationContext.Provider>
  );
};

export default ConfigurationContext;