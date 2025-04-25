// Basic API service structure
const API_URL = 'http://localhost:5000/api'; // Replace with your actual API URL

// Customer endpoints
export const getCustomers = async () => {
  const response = await fetch(`${API_URL}/customers`);
  return response.json();
};

export const getCustomerById = async (id) => {
  const response = await fetch(`${API_URL}/customers/${id}`);
  return response.json();
};

// Quote endpoints
export const getQuotes = async () => {
  const response = await fetch(`${API_URL}/quotes`);
  return response.json();
};

export const createQuote = async (quoteData) => {
  const response = await fetch(`${API_URL}/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteData),
  });
  return response.json();
};

// Add more API endpoints as needed
