import { useContext, useEffect, useRef } from 'react';

//Interfaces
import { CartOrdersContextType, CartOrderTypes } from '../interfaces/CartOrder';
import { ContextValue } from '../interfaces/AuthContext';

//Componentes
import Navbar from '../components/Navbar';
import QuantyEditor from '../components/QuantyEditor';
import CartColumnVariantsNotes from '../components/CartColumnVariantsNotes';
import DeleteCartOrderButton from '../components/DeleteCartOrderButton';
import TotalPriceCard from '../components/TotalPriceCard';

//NextUI
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Link } from '@nextui-org/react';

//Context ==> Carrito de Compras
import { CartOrdersContext } from '../context/CartOrdersContext';
import { AuthContext } from '../context/AuthContext';

//API URL
const API_URL = import.meta.env.VITE_API_URL;

const Cart = () => {
  //Context
  //=> Carrito de Compras
  const { cartOrders, setCartOrders } = useContext(CartOrdersContext) as CartOrdersContextType;
  //=> Token
  const { userToken } = useContext(AuthContext) as ContextValue;

  //Menu del restaurante
  const restaurantMenu = useRef<CartOrderTypes[]>([]);

  useEffect(() => {
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
    fetchingRestaurantMenu();
    // Al cargar el componente, cargar el carrito desde el localStorage
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartOrders') as string;

    if (storedCart) setCartOrders(JSON.parse(storedCart));
  }, [setCartOrders]);

  useEffect(() => {
    // Al cambiar el carrito, actualizar el localStorage
    localStorage.setItem('cartOrders', JSON.stringify(cartOrders));
  }, [cartOrders]);

  return (
    <div className='flex'>
      <Navbar />
      <div className='w-full h-screen flex flex-col justify-between overflow-hidden'>
        <Table aria-label='CartOrders' className={`w-full p-5 overflow-auto ${cartOrders.length === 0 && 'h-60'}`}>
          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Notas / Variantes</TableColumn>
            <TableColumn className='text-center'>Precio Unitario</TableColumn>
            <TableColumn className='text-center'>Cantidad</TableColumn>
            <TableColumn className='text-center'>Total</TableColumn>
            <TableColumn className='text-center'>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {cartOrders &&
              cartOrders.map(({ id, name, price = 0, quanty, buttonsValues = [], extras = [], typeOfProduct }) => (
                <TableRow
                  key={`${id}-${name}-${price}-${buttonsValues[0]?.ingredient}-${buttonsValues[1]?.ingredient}-${buttonsValues[2]?.ingredient}-${buttonsValues[3]?.ingredient}`}
                >
                  <TableCell>{name}</TableCell>
                  <TableCell>
                    <CartColumnVariantsNotes typeOfProduct={typeOfProduct}>
                      {typeOfProduct === 'Custom' && buttonsValues?.length > 0 && <h1 className='mb-2'>Sin:</h1>}

                      {buttonsValues &&
                        Object.values(buttonsValues).map(({ title, ingredient }) => {
                          return (
                            <div key={ingredient}>
                              {typeOfProduct === 'Coffee' && title + ' -'} {typeOfProduct === 'Custom' && '- '}
                              {ingredient}
                            </div>
                          );
                        })}

                      {extras && extras.length > 0 && (
                        <>
                          <h1 className={`${buttonsValues?.length > 0 ? 'py-2' : 'pb-2'}`}>Extra de:</h1>
                          {Object.values(extras)?.map(({ ingredient, price }) => {
                            return (
                              <div key={ingredient}>
                                - {ingredient} (+${price})
                              </div>
                            );
                          })}
                        </>
                      )}
                    </CartColumnVariantsNotes>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center items-center'>
                      <span className='text-xl text-green-700'>$</span>
                      <span className='text-medium'>{Number(price).toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className='flex justify-center'>
                    <QuantyEditor
                      id={id}
                      quanty={quanty}
                      buttonsValues={buttonsValues}
                      extras={extras}
                      setCartOrdersList={setCartOrders}
                    />
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center items-center'>
                      <span className='text-xl text-green-700'>$</span>
                      <span className='text-medium'>{(price * quanty).toFixed(2)}</span>
                    </div>
                  </TableCell>
                  <TableCell className='flex justify-center items-center'>
                    <DeleteCartOrderButton id={id} quanty={quanty} buttonsValues={buttonsValues} extras={extras} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {cartOrders.length === 0 && (
          <div className='rounded-xl h-full mx-5 flex flex-col items-center justify-center gap-5 text-4xl'>
            <h1>No hay Articulos en el Carrito ...</h1>
            <Button variant='ghost' className='text-medium' as={Link} href='/menu' color='primary'>
              Ver el Menu
            </Button>
          </div>
        )}
        <div className='border-2 border-gray-200 rounded-xl m-5'>
          <TotalPriceCard>
            {cartOrders.reduce((acc, { price, quanty }) => acc + (price || 0) * quanty, 0)}
          </TotalPriceCard>
        </div>
      </div>
    </div>
  );
};

export default Cart;
