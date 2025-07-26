import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { Provider } from 'react-redux';
import store from './redux/store';

import { CartProvider } from './context/CartContext.jsx'; // ✅ wrap AuthProvider
import { AuthProvider } from './context/AuthContext.jsx';

import '@fortawesome/fontawesome-free/css/all.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <CartProvider>        {/* ✅ Context order corrected */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </CartProvider>
    </Provider>
  </React.StrictMode>
);