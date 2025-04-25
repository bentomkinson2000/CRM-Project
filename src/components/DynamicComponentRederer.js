// src/components/DynamicComponentRenderer.js
import React, { useEffect, useState } from 'react';
import { useConfiguration } from '../context/ConfigurationContext';

// Import or define your dynamic components here
const componentRegistry = {
  // Dashboard Components
  CustomerStats: React.lazy(() => import('./dashboard/CustomerStats')),
  RecentQuotes: React.lazy(() => import('./dashboard/RecentQuotes')),
  SalesChart: React.lazy(() => import('./dashboard/SalesChart')),
  QuickActions: React.lazy(() => import('./dashboard/QuickActions')),
  UpcomingTasks: React.lazy(() => import('./dashboard/UpcomingTasks')),
  RecentActivity: React.lazy(() => import('./dashboard/RecentActivity')),
  
  // You can add more components for other pages here
};

/**
 * Component that renders dynamic components based on user configuration
 * @param {Object} props
 * @param {string} props.pageName - Name of the page to render components for
 * @param {string} props.containerClassName - Class name for the container
 */
const DynamicComponentRenderer = ({ pageName = 'dashboard', containerClassName = '' }) => {
  const { config, loading } = useConfiguration();
  const [components, setComponents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && config) {
      try {
        // Get layout configuration for the specified page
        const pageLayout = config.layout && config.layout[pageName];
        
        if (pageLayout && pageLayout.activeComponents) {
          setComponents(pageLayout.activeComponents);
        } else {
          // Default components if no configuration exists
          const defaultComponents = getDefaultComponents(pageName);
          setComponents(defaultComponents);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading dynamic components:', err);
        setError('Failed to load components. Please check your configuration.');
        setComponents([]);
      }
    }
  }, [config, loading, pageName]);

  // Get default components for different pages
  const getDefaultComponents = (page) => {
    switch (page) {
      case 'dashboard':
        return ['CustomerStats', 'RecentQuotes', 'SalesChart'];
      // Add cases for other pages as needed
      default:
        return [];
    }
  };

  if (loading) {
    return <div className="loading-components">Loading components...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className={`dynamic-components ${containerClassName}`}>
      <React.Suspense fallback={<div>Loading components...</div>}>
        {components.map((componentKey, index) => {
          const Component = componentRegistry[componentKey];
          
          if (!Component) {
            return (
              <div key={index} className="component-error">
                Component '{componentKey}' not found in registry
              </div>
            );
          }
          
          return (
            <div key={index} className="component-wrapper">
              <Component />
            </div>
          );
        })}
        
        {components.length === 0 && (
          <div className="no-components-message">
            <p>No components configured for this page.</p>
            {pageName === 'dashboard' && (
              <p>You can add components using the Page Builder in the Customization settings.</p>
            )}
          </div>
        )}
      </React.Suspense>
      
      <style jsx>{`
        .dynamic-components {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .component-wrapper {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .loading-components,
        .error-message,
        .no-components-message {
          grid-column: 1 / -1;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          text-align: center;
        }
        
        .error-message {
          color: #dc3545;
        }
        
        .component-error {
          padding: 20px;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: 8px;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default DynamicComponentRenderer;