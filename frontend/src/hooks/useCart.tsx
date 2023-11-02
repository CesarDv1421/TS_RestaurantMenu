import { useContext, useRef } from 'react';

//Context ==> Carrito de Compras
import { CartOrdersContext } from '../context/CartOrdersContext';
import { AuthContext } from '../context/AuthContext';

//Interfaces
import { CartOrdersContextType, CartOrderTypes } from '../interfaces/CartOrder';
import { ContextValue } from '../interfaces/AuthContext';

//API URL
const API_URL = import.meta.env.VITE_API_URL;

const useCart = () => {
  //Context
  //=> Carrito de Compras
  const { setCartOrders } = useContext(CartOrdersContext) as CartOrdersContextType;
  //=> Token
  const { userToken } = useContext(AuthContext) as ContextValue;

  //Menu del restaurante
  const restaurantMenu = useRef<CartOrderTypes[]>([]);

  const fetchingRestaurantMenu = async () => {
    const response = await fetch(`${API_URL}/menu`, {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${userToken}`,
      },
    });
    const { menu } = await response.json();
    restaurantMenu.current = menu;

    const storedCart = localStorage.getItem('cartOrders') as string;
    const cart = JSON.parse(storedCart) as CartOrderTypes[];

    // Filtra los objetos en restaurantMenu que tienen un id que coincide con algún id en storageCartIds.
    const matchingMenuItems = restaurantMenu.current.filter((menuItem) => {
      return (
        cart.map((order) => order.id).includes(menuItem.id) ||
        menuItem?.variants
          ?.map(({ variant }) => variant)
          .some((itemVariant) =>
            cart.some(({ buttonsValues }) => buttonsValues && buttonsValues[0]?.ingredient === itemVariant)
          )
      );
    });

    const PriceOfOrder = cart.map(({ id, name, quanty, buttonsValues, extras, typeOfProduct }) => {
      const foundItem = matchingMenuItems.find(({ variants, name: nombre }) => {
        // Verifica si alguno de los elementos en buttonsValues tiene un ingrediente que coincide con una variante del menú.
        const hasMatchingIngredient = buttonsValues?.some(({ ingredient }) => {
          return variants?.some(({ variant }) => variant === ingredient && name === nombre);
        });
        return hasMatchingIngredient;
      });

      if (foundItem) {
        const a = foundItem.variants.find(({ variant }) => {
          return variant === (buttonsValues && buttonsValues[0].ingredient);
        });

        return {
          id,
          name: foundItem?.name,
          quanty,
          price: a?.price,
          buttonsValues: [{ ingredient: a?.variant }],
          extras,
          typeOfProduct,
        };
      } else {
        const found = matchingMenuItems.find((data) => {
          return data.id === id;
        });

        const calculateTotalPriceWithExtras = extras?.reduce((total, { ingredient }) => {
          const selectedExtra = found?.extras?.find(({ extras }) => extras === ingredient); //Si encuentra el extra seleccionado en la lista de extras
          return Number(total) + (selectedExtra ? selectedExtra.extrasPrice : 0); // Suma su precio al total actual. Si no lo encuentra, simplemente suma 0 al total.
        }, Number(found?.price)); // Asegura que 'price' sea un número al inicio

        return {
          id,
          name: found?.name,
          quanty,
          price: found?.extras ? calculateTotalPriceWithExtras : found?.price,
          buttonsValues,
          extras,
          typeOfProduct,
        };
      }
    });

    if (storedCart) setCartOrders(PriceOfOrder);
  };

  const formatNumberWithPoints = (num: number): string => {
    if (!isNaN(num)) {
      const numStr = num.toFixed(2); // Limitar a 2 decimales
      const parts = numStr.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      return parts.join(',');
    } else {
      return '';
    }
  };

  return {
    fetchingRestaurantMenu,
    formatNumberWithPoints
  };
};

export default useCart;
