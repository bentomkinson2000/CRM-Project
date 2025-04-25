// App.js - Updated with customization features
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigurationProvider } from './context/ConfigurationContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import QuoteList from './pages/QuoteList';
import QuoteCreate from './pages/QuoteCreate';
import QuoteDetail from './pages/QuoteDetail';
import SalesOrderList from './pages/SalesOrderList';
import SalesOrderDetail from './pages/SalesOrderDetail';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import PurchaseOrderList from './pages/PurchaseOrderList';
import PurchaseOrderDetail from './pages/PurchaseOrderDetail';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ProductList from './pages/ProductList';
import CustomizationDashboard from './pages/CustomizationDashboard';
import PageBuilder from './components/PageBuilder';
import CustomFieldManager from './components/CustomFieldManager';
import './styles/App.css';

function App() {
  return (
    <ConfigurationProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="content">
            <Routes>
              {/* Dashboard and Main Pages */}
              <Route path="/" element={<Dashboard />} />
              
              {/* Customer Routes */}
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/customers/:id" element={<CustomerDetail />} />
              
              {/* Quote Routes */}
              <Route path="/quotes" element={<QuoteList />} />
              <Route path="/quotes/create" element={<QuoteCreate />} />
              <Route path="/quotes/:id" element={<QuoteDetail />} />
              
              {/* Sales Order Routes */}
              <Route path="/sales-orders" element={<SalesOrderList />} />
              <Route path="/sales-orders/:id" element={<SalesOrderDetail />} />
              
              {/* Invoice Routes */}
              <Route path="/invoices" element={<InvoiceList />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              
              {/* Purchase Order Routes */}
              <Route path="/purchase-orders" element={<PurchaseOrderList />} />
              <Route path="/purchase-orders/:id" element={<PurchaseOrderDetail />} />
              
              {/* Project Routes */}
              <Route path="/projects" element={<ProjectList />} />
              <Route path="/projects/:id" element={<ProjectDetail />} />
              
              {/* Product Routes */}
              <Route path="/products" element={<ProductList />} />
              
              {/* Customization Routes */}
              <Route path="/customize" element={<CustomizationDashboard />} />
              <Route path="/customize/fields" element={<CustomFieldManager />} />
              <Route path="/customize/pages/:pageName" element={<PageBuilder />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ConfigurationProvider>
  );
}

export default App;