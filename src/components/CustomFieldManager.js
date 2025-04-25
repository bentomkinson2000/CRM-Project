// src/components/CustomFieldManager.js
import React, { useState, useEffect } from 'react';
import { useConfiguration } from '../context/ConfigurationContext';
import { PlusCircle, Edit2, Trash2, Save, X } from 'lucide-react';

// Field type options
const fieldTypes = [
  { value: 'text', label: 'Text Input' },
  { value: 'textarea', label: 'Text Area' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' }
];

// Entity type options (these should match your CRM's entities)
const entityTypes = [
  { value: 'customer', label: 'Customer' },
  { value: 'quote', label: 'Quote' },
  { value: 'project', label: 'Project' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'product', label: 'Product' }
];



/**
 * Component for managing custom fields in the CRM
 */
const CustomFieldManager = () => {
  const { config, loading, addCustomField, updateCustomField, deleteCustomField } = useConfiguration();
  const [customFields, setCustomFields] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState(null);
  const [newField, setNewField] = useState({
    entity: '',
    name: '',
    label: '',
    type: 'text',
    required: false,
    options: '',
    placeholder: '',
    defaultValue: ''
  });
  const [selectedEntity, setSelectedEntity] = useState('all');
  const [errors, setErrors] = useState({});

  // Load custom fields when configuration is available
  useEffect(() => {
    if (config && !loading) {
      setCustomFields(config.customFields || []);
    }
  }, [config, loading]);

  // Handle selecting an entity for filtering
  const handleEntityFilter = (entity) => {
    setSelectedEntity(entity);
  };

  // Handle input changes for the new field form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewField(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Validate the field form
  const validateFieldForm = () => {
    const newErrors = {};
    
    if (!newField.entity) {
      newErrors.entity = 'Entity is required';
    }
    
    if (!newField.name) {
      newErrors.name = 'Field name is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(newField.name)) {
      newErrors.name = 'Field name can only contain letters, numbers, and underscores';
    }
    
    if (!newField.label) {
      newErrors.label = 'Display label is required';
    }
    
    if (newField.type === 'dropdown' && !newField.options) {
      newErrors.options = 'Options are required for dropdown fields';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding a new custom field
  const handleAddField = async () => {
    if (!validateFieldForm()) {
      return;
    }
    
    const fieldToAdd = {
      ...newField
    };
    
    // Convert options string to array for dropdown fields
    if (newField.type === 'dropdown' && newField.options) {
      fieldToAdd.options = newField.options.split(',').map(opt => opt.trim());
    }
    
    const success = await addCustomField(fieldToAdd);
    
    if (success) {
      resetNewField();
      setShowAddForm(false);
    } else {
      alert('Failed to add custom field. Please try again.');
    }
  };

  // Handle updating an existing custom field
  const handleUpdateField = async () => {
    if (!validateFieldForm()) {
      return;
    }
    
    const fieldToUpdate = {
      ...newField
    };
    
    // Convert options string to array for dropdown fields
    if (newField.type === 'dropdown' && newField.options) {
      fieldToUpdate.options = newField.options.split(',').map(opt => opt.trim());
    }
    
    const success = await updateCustomField(editingFieldId, fieldToUpdate);
    
    if (success) {
      resetNewField();
      setEditingFieldId(null);
    } else {
      alert('Failed to update custom field. Please try again.');
    }
  };

  // Handle deleting a custom field
  const handleDeleteField = async (fieldId) => {
    // Confirm before deleting
    if (!window.confirm('Are you sure you want to delete this field? This action cannot be undone and may result in data loss.')) {
      return;
    }
    
    const success = await deleteCustomField(fieldId);
    
    if (!success) {
      alert('Failed to delete custom field. Please try again.');
    }
  };

  // Start editing a field
  const handleEditField = (field) => {
    // Convert options array to string for editing
    const fieldToEdit = {
      ...field,
      options: field.options && Array.isArray(field.options) 
        ? field.options.join(', ') 
        : field.options || ''
    };
    
    setNewField(fieldToEdit);
    setEditingFieldId(field.id);
    setShowAddForm(false); // Close add form if it's open
    setErrors({});
  };

  // Reset the new field form
  const resetNewField = () => {
    setNewField({
      entity: '',
      name: '',
      label: '',
      type: 'text',
      required: false,
      options: '',
      placeholder: '',
      defaultValue: ''
    });
    setErrors({});
  };

  // Cancel editing or adding
  const handleCancel = () => {
    if (editingFieldId) {
      setEditingFieldId(null);
    } else {
      setShowAddForm(false);
    }
    resetNewField();
  };

  // Filter fields based on selected entity
  const filteredFields = selectedEntity === 'all' 
    ? customFields 
    : customFields.filter(field => field.entity.toLowerCase() === selectedEntity.toLowerCase());

  if (loading) {
    return <div>Loading custom field manager...</div>;
  }

  return (
    <div className="custom-field-manager">
      <div className="custom-field-header">
        <h2>Custom Fields</h2>
        {!showAddForm && !editingFieldId && (
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetNewField();
              setShowAddForm(true);
            }}
          >
            <PlusCircle size={16} className="mr-2" />
            Add Custom Field
          </button>
        )}
      </div>
      
      <div className="entity-filter">
        <label htmlFor="entity-filter">Filter by Entity:</label>
        <select 
          id="entity-filter"
          value={selectedEntity}
          onChange={(e) => handleEntityFilter(e.target.value)}
          className="entity-filter-select"
        >
          <option value="all">All Entities</option>
          {entityTypes.map(entity => (
            <option key={entity.value} value={entity.value}>{entity.label}</option>
          ))}
        </select>
      </div>
      
      {/* Add/Edit Form */}
      {(showAddForm || editingFieldId) && (
        <div className="custom-field-form">
          <h3>{editingFieldId ? 'Edit Field' : 'Add New Field'}</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="entity">Entity Type<span className="required">*</span></label>
              <select 
                id="entity"
                name="entity"
                value={newField.entity}
                onChange={handleInputChange}
                className={`form-control ${errors.entity ? 'is-invalid' : ''}`}
                required
              >
                <option value="">Select Entity</option>
                {entityTypes.map(entity => (
                  <option key={entity.value} value={entity.value}>{entity.label}</option>
                ))}
              </select>
              {errors.entity && <div className="invalid-feedback">{errors.entity}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="type">Field Type<span className="required">*</span></label>
              <select 
                id="type"
                name="type"
                value={newField.type}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                {fieldTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Field Name<span className="required">*</span></label>
              <input 
                type="text"
                id="name"
                name="name"
                value={newField.name}
                onChange={handleInputChange}
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                placeholder="customer_industry (no spaces, use underscores)"
                required
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              <small className="form-text text-muted">
                Internal field name. Use only letters, numbers, and underscores.
              </small>
            </div>
            
            <div className="form-group">
              <label htmlFor="label">Display Label<span className="required">*</span></label>
              <input 
                type="text"
                id="label"
                name="label"
                value={newField.label}
                onChange={handleInputChange}
                className={`form-control ${errors.label ? 'is-invalid' : ''}`}
                placeholder="Industry"
                required
              />
              {errors.label && <div className="invalid-feedback">{errors.label}</div>}
              <small className="form-text text-muted">
                Label shown to users in forms.
              </small>
            </div>
          </div>
          
          {newField.type === 'dropdown' && (
            <div className="form-group">
              <label htmlFor="options">Dropdown Options<span className="required">*</span></label>
              <input 
                type="text"
                id="options"
                name="options"
                value={newField.options}
                onChange={handleInputChange}
                className={`form-control ${errors.options ? 'is-invalid' : ''}`}
                placeholder="Option 1, Option 2, Option 3"
                required
              />
              {errors.options && <div className="invalid-feedback">{errors.options}</div>}
              <small className="form-text text-muted">
                Comma-separated list of options.
              </small>
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="placeholder">Placeholder Text</label>
              <input 
                type="text"
                id="placeholder"
                name="placeholder"
                value={newField.placeholder}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter placeholder text..."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="defaultValue">Default Value</label>
              <input 
                type="text"
                id="defaultValue"
                name="defaultValue"
                value={newField.defaultValue}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Enter default value..."
              />
            </div>
          </div>
          
          <div className="form-group form-check">
            <input 
              type="checkbox"
              id="required"
              name="required"
              checked={newField.required}
              onChange={handleInputChange}
              className="form-check-input"
            />
            <label htmlFor="required" className="form-check-label">
              Required Field
            </label>
          </div>
          
          <div className="form-actions">
            <button 
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              <X size={16} className="mr-1" />
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={editingFieldId ? handleUpdateField : handleAddField}
            >
              <Save size={16} className="mr-1" />
              {editingFieldId ? 'Update Field' : 'Add Field'}
            </button>
          </div>
        </div>
      )}
      
      {/* Custom Fields List */}
      {filteredFields.length > 0 ? (
        <div className="custom-fields-table">
          <table className="table">
            <thead>
              <tr>
                <th>Entity</th>
                <th>Field Name</th>
                <th>Label</th>
                <th>Type</th>
                <th>Required</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.map(field => (
                <tr key={field.id}>
                  <td>{field.entity}</td>
                  <td>{field.name}</td>
                  <td>{field.label}</td>
                  <td>{field.type}</td>
                  <td>{field.required ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="field-actions">
                      <button 
                        className="btn-icon btn-edit"
                        onClick={() => handleEditField(field)}
                        disabled={editingFieldId === field.id}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-delete"
                        onClick={() => handleDeleteField(field.id)}
                        disabled={editingFieldId === field.id}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-fields-message">
          {selectedEntity === 'all' 
            ? 'No custom fields have been created yet. Click the "Add Custom Field" button to create your first custom field.'
            : `No custom fields have been created for ${selectedEntity} yet.`}
        </div>
      )}
      
      <style jsx>{`
        .custom-field-manager {
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
        }
        
        .custom-field-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .entity-filter {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }
        
        .entity-filter label {
          margin-right: 10px;
          font-weight: 500;
        }
        
        .entity-filter-select {
          padding: 8px;
          border-radius: 4px;
          border: 1px solid #ced4da;
          min-width: 200px;
        }
        
        .custom-field-form {
          background-color: #f8f9fa;
          border-radius: 6px;
          padding: 20px;
          margin-bottom: 20px;
          border: 1px solid #e9ecef;
        }
        
        .custom-field-form h3 {
          margin-bottom: 15px;
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        .form-row {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-row .form-group {
          flex: 1;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        
        .required {
          color: #dc3545;
          margin-left: 3px;
        }
        
        .form-control {
          display: block;
          width: 100%;
          padding: 8px;
          font-size: 1rem;
          line-height: 1.5;
          color: #495057;
          background-color: #fff;
          border: 1px solid #ced4da;
          border-radius: 4px;
        }
        
        .form-control.is-invalid {
          border-color: #dc3545;
        }
        
        .invalid-feedback {
          display: block;
          width: 100%;
          margin-top: 5px;
          font-size: 0.875rem;
          color: #dc3545;
        }
        
        .form-check {
          display: flex;
          align-items: center;
        }
        
        .form-check-input {
          margin-right: 8px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .custom-fields-table {
          margin-top: 20px;
          overflow-x: auto;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .table th,
        .table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .table th {
          background-color: #f8f9fa;
          font-weight: 600;
        }
        
        .field-actions {
          display: flex;
          gap: 8px;
        }
        
        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
        }
        
        .btn-edit {
          color: #007bff;
        }
        
        .btn-edit:hover {
          background-color: rgba(0, 123, 255, 0.1);
        }
        
        .btn-delete {
          color: #dc3545;
        }
        
        .btn-delete:hover {
          background-color: rgba(220, 53, 69, 0.1);
        }
        
        .no-fields-message {
          text-align: center;
          padding: 30px;
          background-color: #f8f9fa;
          border-radius: 6px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default CustomFieldManager;