// App.js - Main component structure
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/:id" element={<CustomerDetail />} />
            <Route path="/quotes" element={<QuoteList />} />
            <Route path="/quotes/create" element={<QuoteCreate />} />
            <Route path="/quotes/:id" element={<QuoteDetail />} />
            <Route path="/sales-orders" element={<SalesOrderList />} />
            <Route path="/sales-orders/:id" element={<SalesOrderDetail />} />
            <Route path="/invoices" element={<InvoiceList />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
            <Route path="/purchase-orders" element={<PurchaseOrderList />} />
            <Route path="/purchase-orders/:id" element={<PurchaseOrderDetail />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/products" element={<ProductList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;