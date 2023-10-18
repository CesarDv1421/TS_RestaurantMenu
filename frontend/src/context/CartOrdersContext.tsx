import React, { useState, createContext } from 'react';

//Interfaces
import { CartOrderTypes, CartOrdersContextType } from '../interfaces/CartOrder';
import { ChildrenProps } from '../interfaces/ChildrenProps';

const CartOrdersContext = createContext<CartOrdersContextType | null>(null);

const CartOrdersProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [cartOrders, setCartOrders] = useState<CartOrderTypes[]>([]); //Almacena en el carrito las ordenes para luego renderizarlo.

  return (
    <CartOrdersContext.Provider
      value={{
        cartOrders,
        setCartOrders,
      }}
    >
      {children}
    </CartOrdersContext.Provider>
  );
};

export { CartOrdersContext, CartOrdersProvider };
