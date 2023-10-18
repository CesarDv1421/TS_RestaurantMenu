import React from 'react';

//Objetos de el CartOrders

export interface TogglesValues {
  name: string;
  title: string;
  ingredient: string;
  price?: number;
}

export interface ExtraItem {
  extras: string;
  extrasPrice: number;
  ingredient?: string;
  price?: number;
}

export interface Variants {
  variant: string;
  price: number;
}

export interface ingredients {
  ingredient: string;
}

//CartOrders

export interface CartOrderTypes {
  id: number;
  img: string;
  name: string;
  description: string;
  quanty: number;
  price?: number;
  category: string;
  variants: Variants[];
  ingredients: ingredients[];
  buttonsValues?: TogglesValues[];
  extras?: ExtraItem[];
  typeOfProduct: string;
}

export interface CartOrderOnCart {
  id: number;
  name: string;
  quanty: number;
  price?: number;
  buttonsValues?: TogglesValues[];
  extras?: ExtraItem[];
  typeOfProduct: string;
}

//Tipado del estado del contexto

export interface CartOrdersContextType {
  cartOrders: CartOrderTypes[];
  setCartOrders: React.Dispatch<React.SetStateAction<CartOrderOnCarts[]>>;
}

//Tipado del Custom Hook

export interface useCartOrdersReturnType {
  onDeleteCartOrder: () => void;
  newQuanty: number;
  setNewQuanty: React.Dispatch<React.SetStateAction<number>>;
}
