import { useState, useEffect, useContext } from 'react';

//Interfaces
import { TogglesValues, ExtraItem } from '../interfaces/CartOrder';
import { CartOrdersContextType } from '../interfaces/CartOrder';

//Context => CartOrders / Carrito de compras
import { CartOrdersContext } from '../context/CartOrdersContext';

const useCartOrders = (
  id: number,
  quanty: number,
  buttonsValues: TogglesValues[],
  extras: ExtraItem[]
): {
  onDeleteCartOrder: () => void;
  newQuanty: number;
  setNewQuanty: React.Dispatch<React.SetStateAction<number>>;
} => {
  const [newQuanty, setNewQuanty] = useState(quanty);

  const { setCartOrders } = useContext(CartOrdersContext) as CartOrdersContextType;

  useEffect(() => {
    //Actualizar la cantidad del producto del carrito de compras cada vez que se agregue o sustraiga la cantidad del plato
    setCartOrders((prevOrders) => {
      return prevOrders.map((order) =>
        order.id === id &&
        order.buttonsValues?.every(
          ({ ingredient }: { ingredient: string }, index: number) => ingredient === buttonsValues[index]?.ingredient
        )
          ? {
              ...order,
              quanty: newQuanty,
            }
          : order
      );
    });
  }, [newQuanty]);

  const onDeleteCartOrder = () => {
    console.log('asdasd');
    setCartOrders((prevOrders) => {
      const deletedOrder = prevOrders.filter((order) => {
        if (order.typeOfProduct === 'Normal') return order.id !== id;

        if (order.typeOfProduct === 'Variants' || order.typeOfProduct === 'Coffee') {
          const variantsMatch = order.buttonsValues?.every(({ ingredient }: { ingredient: string }, index: number) => {
            return ingredient === buttonsValues[index]?.ingredient;
          });

          return order.id !== id || !variantsMatch;
        }

        if (order.typeOfProduct === 'Custom') {
          // Verificar si los ingredientes de buttonsValues coinciden exactamente
          const buttonsMatch =
            (!order.buttonsValues && !buttonsValues) ||
            (order.buttonsValues &&
              order.buttonsValues.length === buttonsValues.length &&
              order.buttonsValues.every(({ ingredient }: { ingredient: string }, index: number) => {
                return ingredient === buttonsValues[index]?.ingredient;
              }));

          // Verificar si los ingredientes de extras coinciden exactamente
          const extrasMatch =
            (!order.extras && !extras) ||
            (order.extras &&
              order.extras.length === extras.length &&
              order.extras.every(({ ingredient }: { ingredient: string }, index: number) => {
                return ingredient === extras[index]?.ingredient;
              }));

          // Si tanto los ingredientes de buttonsValues como los de extras coinciden o son nulos/vacíos, no eliminar la orden
          if (buttonsMatch && extrasMatch) return false;

          // Si no coinciden los ingredientes de buttonsValues o extras, eliminar la orden
          return true;
        }
      });
      console.log(deletedOrder);
      return deletedOrder;
    });
  };

  return {
    onDeleteCartOrder,
    newQuanty,
    setNewQuanty,
  };
};

export default useCartOrders;
