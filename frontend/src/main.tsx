import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { NextUIProvider } from '@nextui-org/react';
import { AuthProvider } from './context/AuthContext';
import { CartOrdersProvider } from './context/CartOrdersContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <AuthProvider>
      <CartOrdersProvider>
        <App />
      </CartOrdersProvider>
    </AuthProvider>
  </NextUIProvider>
);
