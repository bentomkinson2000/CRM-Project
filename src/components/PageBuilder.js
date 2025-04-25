// src/components/PageBuilder.js
import React, { useState, useEffect } from 'react';
import { useConfiguration } from '../context/ConfigurationContext';

// Component definitions - these would typically be imported from a component library
const availableComponents = {
  CustomerStats: {
    name: 'Customer Statistics',
    description: 'Displays key customer metrics',
    icon: 'users'
  },
  RecentQuotes: {
    name: 'Recent Quotes',
    description: 'Shows a list of recent quotes',
    icon: 'file-text'
  },
  SalesChart: {
    name: 'Sales Chart',
    description: 'Visualizes sales performance',
    icon: 'bar-chart'
  },
  QuickActions: {
    name: 'Quick Actions',
    description: 'Shows common actions for easy access',
    icon: 'zap'
  },
  UpcomingTasks: {
    name: 'Upcoming Tasks',
    description: 'Lists tasks due soon',
    icon: 'check-square'
  },
  RecentActivity: {
    name: 'Recent Activity',
    description: 'Shows recent system activity',
    icon: 'activity'
  }
};

/**
 * Simple drag and drop page builder for customizing layouts
 */
const PageBuilder = ({ pageName = 'dashboard' }) => {
  const { config, loading, updateLayout } = useConfiguration();
  const [layout, setLayout] = useState({
    activeComponents: [],
    gridLayout: {}
  });
  const [availableList, setAvailableList] = useState([]);
  const [activeList, setActiveList] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isModified, setIsModified] = useState(false);

  // Load the layout configuration
  useEffect(() => {
    if (config && !loading) {
      const pageLayout = config.layout && config.layout[pageName] 
        ? config.layout[pageName] 
        : { activeComponents: [], gridLayout: {} };
      
      setLayout(pageLayout);
      
      // Initialize available and active component lists
      const active = pageLayout.activeComponents || [];
      const available = Object.keys(availableComponents).filter(key => !active.includes(key));
      
      setAvailableList(available);
      setActiveList(active);
    }
  }, [config, loading, pageName]);

  // Handle dragging start
  const handleDragStart = (e, componentKey, fromList) => {
    setDraggedItem({
      componentKey,
      fromList
    });
    
    // Set transparent drag ghost image
    const dragGhost = document.createElement('div');
    dragGhost.style.opacity = '0.4';
    document.body.appendChild(dragGhost);
    e.dataTransfer.setDragImage(dragGhost, 0, 0);
    
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle dragging over a drop zone
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Handle dropping a component
  const handleDrop = (e, toList, index = null) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const { componentKey, fromList } = draggedItem;
    
    // Don't do anything if dropped in the same list at the same position
    if (fromList === toList && index === activeList.indexOf(componentKey)) {
      setDraggedItem(null);
      return;
    }
    
    // Create new lists based on the drag and drop action
    let newAvailableList = [...availableList];
    let newActiveList = [...activeList];
    
    // Remove from source list
    if (fromList === 'available') {
      newAvailableList = newAvailableList.filter(key => key !== componentKey);
    } else {
      newActiveList = newActiveList.filter(key => key !== componentKey);
    }
    
    // Add to destination list
    if (toList === 'available') {
      newAvailableList.push(componentKey);
    } else {
      if (index !== null) {
        newActiveList.splice(index, 0, componentKey);
      } else {
        newActiveList.push(componentKey);
      }
    }
    
    // Update state
    setAvailableList(newAvailableList);
    setActiveList(newActiveList);
    setDraggedItem(null);
    setIsModified(true);
  };

  // Handle dropping between components
  const handleDropBetween = (e, index) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const { componentKey, fromList } = draggedItem;
    
    // Create new lists based on the drag and drop action
    let newAvailableList = [...availableList];
    let newActiveList = [...activeList];
    
    // Remove from source list
    if (fromList === 'available') {
      newAvailableList = newAvailableList.filter(key => key !== componentKey);
    } else {
      newActiveList = newActiveList.filter(key => key !== componentKey);
    }
    
    // Add to active list at the specified index
    newActiveList.splice(index, 0, componentKey);
    
    // Update state
    setAvailableList(newAvailableList);
    setActiveList(newActiveList);
    setDraggedItem(null);
    setIsModified(true);
  };

  // Save the current layout
  const saveLayout = async () => {
    const newLayout = {
      activeComponents: activeList,
      gridLayout: layout.gridLayout // We're not modifying the grid layout in this example
    };
    
    const success = await updateLayout(pageName, newLayout);
    
    if (success) {
      setIsModified(false);
      alert('Layout saved successfully!');
    } else {
      alert('Error saving layout. Please try again.');
    }
  };

  // Reset to last saved layout
  const resetLayout = () => {
    if (config && config.layout && config.layout[pageName]) {
      const savedLayout = config.layout[pageName];
      const active = savedLayout.activeComponents || [];
      const available = Object.keys(availableComponents).filter(key => !active.includes(key));
      
      setLayout(savedLayout);
      setActiveList(active);
      setAvailableList(available);
      setIsModified(false);
    }
  };

  if (loading) {
    return <div>Loading page builder...</div>;
  }

  return (
    <div className="page-builder">
      <div className="page-builder-header">
        <h2>Page Builder: {pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h2>
        <div className="page-builder-actions">
          {isModified && (
            <button 
              className="btn btn-secondary mr-2"
              onClick={resetLayout}
            >
              Reset
            </button>
          )}
          <button 
            className="btn btn-primary"
            onClick={saveLayout}
            disabled={!isModified}
          >
            Save Layout
          </button>
        </div>
      </div>
      
      <div className="page-builder-container">
        <div className="component-palette">
          <h3>Available Components</h3>
          <div 
            className="component-list available-components"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'available')}
          >
            {availableList.length === 0 ? (
              <div className="empty-list-message">All components are being used</div>
            ) : (
              availableList.map((componentKey) => {
                const component = availableComponents[componentKey];
                return (
                  <div 
                    key={componentKey}
                    className="component-item"
                    draggable
                    onDragStart={(e) => handleDragStart(e, componentKey, 'available')}
                  >
                    <div className="component-icon">{component.icon}</div>
                    <div className="component-info">
                      <div className="component-name">{component.name}</div>
                      <div className="component-description">{component.description}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        
        <div className="page-canvas">
          <h3>Page Layout</h3>
          <div className="canvas-container">
            <div 
              className="drop-zone-container active-components"
              onDragOver={handleDragOver}
            >
              {activeList.length === 0 ? (
                <div 
                  className="empty-canvas-message"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, 'active')}
                >
                  Drag components here to add them to the page
                </div>
              ) : (
                <>
                  {/* First drop zone */}
                  <div 
                    className="component-drop-zone between-zone"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropBetween(e, 0)}
                  ></div>
                  
                  {/* Components and drop zones between them */}
                  {activeList.map((componentKey, index) => {
                    const component = availableComponents[componentKey];
                    return (
                      <React.Fragment key={componentKey}>
                        <div 
                          className="component-item active-component"
                          draggable
                          onDragStart={(e) => handleDragStart(e, componentKey, 'active')}
                        >
                          <div className="component-info">
                            <div className="component-name">{component.name}</div>
                            <div className="component-description">{component.description}</div>
                          </div>
                          <div className="component-actions">
                            <button 
                              className="btn-remove"
                              onClick={() => {
                                const newActiveList = activeList.filter(key => key !== componentKey);
                                const newAvailableList = [...availableList, componentKey];
                                setActiveList(newActiveList);
                                setAvailableList(newAvailableList);
                                setIsModified(true);
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        
                        {/* Drop zone after each component */}
                        <div 
                          className="component-drop-zone between-zone"
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDropBetween(e, index + 1)}
                        ></div>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="page-builder-preview">
        <h3>Preview</h3>
        <div className="preview-container">
          <p className="preview-message">
            This would show a live preview of the page layout.
          </p>
        </div>
      </div>
      
      <style jsx>{`
        .page-builder {
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }
        
        .page-builder-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .page-builder-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .component-palette,
        .page-canvas {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 15px;
          border: 1px solid #e9ecef;
        }
        
        .component-list,
        .drop-zone-container {
          min-height: 300px;
          border: 2px dashed #dee2e6;
          border-radius: 6px;
          padding: 10px;
          background-color: white;
        }
        
        .component-item {
          display: flex;
          align-items: center;
          padding: 10px;
          margin-bottom: 10px;
          background-color: white;
          border: 1px solid #e9ecef;
          border-radius: 4px;
          cursor: move;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .active-component {
          background-color: #e6f2ff;
          border-color: #b8daff;
        }
        
        .component-icon {
          font-size: 24px;
          color: #6c757d;
          margin-right: 15px;
        }
        
        .component-info {
          flex: 1;
        }
        
        .component-name {
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .component-description {
          font-size: 12px;
          color: #6c757d;
        }
        
        .component-actions {
          margin-left: 10px;
        }
        
        .btn-remove {
          background-color: transparent;
          color: #dc3545;
          border: 1px solid #dc3545;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 12px;
          cursor: pointer;
        }
        
        .btn-remove:hover {
          background-color: #dc3545;
          color: white;
        }
        
        .component-drop-zone {
          height: 20px;
          margin: 5px 0;
          background-color: rgba(0, 123, 255, 0.1);
          border-radius: 4px;
          border: 2px dashed rgba(0, 123, 255, 0.2);
        }
        
        .component-drop-zone.between-zone {
          height: 10px;
        }
        
        .empty-list-message,
        .empty-canvas-message {
          padding: 20px;
          text-align: center;
          color: #6c757d;
          font-style: italic;
        }
        
        .page-builder-preview {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 15px;
          border: 1px solid #e9ecef;
        }
        
        .preview-container {
          min-height: 200px;
          background-color: white;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .preview-message {
          color: #6c757d;
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default PageBuilder;