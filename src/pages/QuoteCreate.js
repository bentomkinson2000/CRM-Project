// pages/QuoteCreate.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuoteCreate.css';

const QuoteCreate = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [quote, setQuote] = useState({
    customerId: '',
    quoteDate: new Date().toISOString().substr(0, 10),
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10),
    items: [],
    notes: '',
    totalAmount: 0
  });

  // Fetch customers and products from API
  useEffect(() => {
    // Simulated API calls - replace with actual API calls
    setCustomers([
      { id: 1, name: 'Acme Corporation' },
      { id: 2, name: 'Global Industries' },
      { id: 3, name: 'Tech Solutions Inc.' }
    ]);
    
    setProducts([
      { id: 1, name: 'Web Development', sku: 'WEB-001', description: 'Custom website development', price: 2500 },
      { id: 2, name: 'Mobile App', sku: 'APP-001', description: 'Mobile application development', price: 4000 },
      { id: 3, name: 'CRM Integration', sku: 'CRM-001', description: 'CRM system integration', price: 1500 }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuote({ ...quote, [name]: value });
  };

  const addItem = () => {
    setQuote({
      ...quote,
      items: [...quote.items, { productId: '', quantity: 1, unitPrice: 0, lineTotal: 0 }]
    });
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...quote.items];
    updatedItems[index][field] = value;
    
    // If product changed, update unitPrice
    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        updatedItems[index].unitPrice = product.price;
        updatedItems[index].lineTotal = product.price * updatedItems[index].quantity;
      }
    }
    
    // If quantity changed, update lineTotal
    if (field === 'quantity') {
      updatedItems[index].lineTotal = updatedItems[index].unitPrice * parseInt(value);
    }
    
    // Calculate total amount
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
    
    setQuote({
      ...quote,
      items: updatedItems,
      totalAmount
    });
  };

  const removeItem = (index) => {
    const updatedItems = quote.items.filter((_, i) => i !== index);
    const totalAmount = updatedItems.reduce((sum, item) => sum + (item.lineTotal || 0), 0);
    
    setQuote({
      ...quote,
      items: updatedItems,
      totalAmount
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create quote submission logic
    console.log('Submitting quote:', quote);
    
    // Simulate API call
    setTimeout(() => {
      // On success, navigate to quotes list
      navigate('/quotes');
    }, 1000);
  };

  return (
    <div className="quote-create">
      <div className="page-header">
        <h1>Create New Quote</h1>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Quote Details</h2>
          
          <div className="form-group">
            <label htmlFor="customerId">Customer</label>
            <select 
              id="customerId" 
              name="customerId" 
              value={quote.customerId} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select Customer</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>{customer.name}</option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quoteDate">Quote Date</label>
              <input 
                type="date" 
                id="quoteDate" 
                name="quoteDate" 
                value={quote.quoteDate} 
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="expirationDate">Expiration Date</label>
              <input 
                type="date" 
                id="expirationDate" 
                name="expirationDate" 
                value={quote.expirationDate} 
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <div className="section-header">
            <h2>Quote Items</h2>
            <button type="button" className="btn btn-secondary" onClick={addItem}>Add Item</button>
          </div>
          
          {quote.items.length === 0 ? (
            <div className="empty-state">
              <p>No items added. Click "Add Item" to add products to this quote.</p>
            </div>
          ) : (
            <div className="quote-items">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          value={item.productId}
                          onChange={(e) => updateItem(index, 'productId', e.target.value)}
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map(product => (
                            <option key={product.id} value={product.id}>{product.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                          required
                        />
                      </td>
                      <td>${item.unitPrice.toFixed(2)}</td>
                      <td>${item.lineTotal.toFixed(2)}</td>
                      <td>
                        <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-right"><strong>Total:</strong></td>
                    <td><strong>${quote.totalAmount.toFixed(2)}</strong></td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
        
        <div className="form-section">
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={quote.notes}
              onChange={handleInputChange}
              rows="4"
            />
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/quotes')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Quote
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuoteCreate;