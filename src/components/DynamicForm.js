// src/components/DynamicForm.js
import React, { useState, useEffect } from 'react';
import { useConfiguration } from '../context/ConfigurationContext';

/**
 * DynamicForm component that renders a form based on field definitions
 * including both standard fields and custom fields
 */
const DynamicForm = ({ 
  entityType, 
  initialData = {}, 
  standardFields = [], 
  onSubmit, 
  submitButtonText = 'Save' 
}) => {
  const { config, loading } = useConfiguration();
  const [formData, setFormData] = useState(initialData);
  const [customFields, setCustomFields] = useState([]);
  const [errors, setErrors] = useState({});

  // Load custom fields for this entity type
  useEffect(() => {
    if (config && !loading) {
      // Filter custom fields for this entity type
      const fields = config.customFields.filter(
        field => field.entity.toLowerCase() === entityType.toLowerCase()
      );
      setCustomFields(fields);
      
      // Initialize form data with empty values for custom fields if not in initialData
      const customFieldInitialData = {};
      fields.forEach(field => {
        if (!(field.name in formData)) {
          // Set default values based on field type
          switch(field.type) {
            case 'checkbox':
              customFieldInitialData[field.name] = false;
              break;
            case 'number':
              customFieldInitialData[field.name] = 0;
              break;
            case 'dropdown':
              customFieldInitialData[field.name] = field.options && field.options.length > 0 
                ? field.options[0] 
                : '';
              break;
            default:
              customFieldInitialData[field.name] = '';
          }
        }
      });
      
      setFormData(prev => ({
        ...prev,
        ...customFieldInitialData
      }));
    }
  }, [config, loading, entityType, formData]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle different input types
    const fieldValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: fieldValue
    });
    
    // Clear error for this field when value changes
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate standard fields
    standardFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });
    
    // Validate custom fields
    customFields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = `${field.name} is required`;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
    }
  };

  // Render a field based on its type
  const renderField = (field, isCustom = false) => {
    const fieldName = field.name;
    const fieldLabel = field.label || field.name;
    const fieldType = field.type || 'text';
    const fieldValue = formData[fieldName] !== undefined ? formData[fieldName] : '';
    const fieldError = errors[fieldName];
    
    switch (fieldType) {
      case 'textarea':
        return (
          <div key={fieldName} className="form-group">
            <label htmlFor={fieldName}>{fieldLabel}</label>
            <textarea
              id={fieldName}
              name={fieldName}
              value={fieldValue}
              onChange={handleChange}
              className={`form-control ${fieldError ? 'is-invalid' : ''}`}
              rows="4"
            />
            {fieldError && <div className="invalid-feedback">{fieldError}</div>}
          </div>
        );
        
      case 'dropdown':
        return (
          <div key={fieldName} className="form-group">
            <label htmlFor={fieldName}>{fieldLabel}</label>
            <select
              id={fieldName}
              name={fieldName}
              value={fieldValue}
              onChange={handleChange}
              className={`form-control ${fieldError ? 'is-invalid' : ''}`}
            >
              <option value="">Select {fieldLabel}</option>
              {field.options && field.options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
            {fieldError && <div className="invalid-feedback">{fieldError}</div>}
          </div>
        );
        
      case 'checkbox':
        return (
          <div key={fieldName} className="form-group form-check">
            <input
              type="checkbox"
              id={fieldName}
              name={fieldName}
              checked={fieldValue}
              onChange={handleChange}
              className={`form-check-input ${fieldError ? 'is-invalid' : ''}`}
            />
            <label htmlFor={fieldName} className="form-check-label">{fieldLabel}</label>
            {fieldError && <div className="invalid-feedback">{fieldError}</div>}
          </div>
        );
        
      case 'date':
        return (
          <div key={fieldName} className="form-group">
            <label htmlFor={fieldName}>{fieldLabel}</label>
            <input
              type="date"
              id={fieldName}
              name={fieldName}
              value={fieldValue}
              onChange={handleChange}
              className={`form-control ${fieldError ? 'is-invalid' : ''}`}
            />
            {fieldError && <div className="invalid-feedback">{fieldError}</div>}
          </div>
        );
        
      case 'number':
        return (
          <div key={fieldName} className="form-group">
            <label htmlFor={fieldName}>{fieldLabel}</label>
            <input
              type="number"
              id={fieldName}
              name={fieldName}
              value={fieldValue}
              onChange={handleChange}
              className={`form-control ${fieldError ? 'is-invalid' : ''}`}
              min={field.min}
              max={field.max}
              step={field.step || 1}
            />
            {fieldError && <div className="invalid-feedback">{fieldError}</div>}
          </div>
        );
        
      default: // text input (default)
        return (
          <div key={fieldName} className="form-group">
            <label htmlFor={fieldName}>{fieldLabel}</label>
            <input
              type="text"
              id={fieldName}
              name={fieldName}
              value={fieldValue}
              onChange={handleChange}
              className={`form-control ${fieldError ? 'is-invalid' : ''}`}
              placeholder={field.placeholder}
            />
            {fieldError && <div className="invalid-feedback">{fieldError}</div>}
          </div>
        );
    }
  };

  if (loading) {
    return <div>Loading form...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Render standard fields */}
      {standardFields.map(field => renderField(field))}
      
      {/* Render custom fields if any */}
      {customFields.length > 0 && (
        <div className="custom-fields-section">
          <h3 className="custom-fields-title">Additional Information</h3>
          {customFields.map(field => renderField(field, true))}
        </div>
      )}
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;


