import { useEffect, useContext } from 'react';

//interfaces
import { CartOrdersContextType } from '../interfaces/CartOrder';

//Context ==> Carrito de Compras
import { CartOrdersContext } from '../context/CartOrdersContext';

//Componentes
import Navbar from '../components/Navbar';
import QuantyEditor from '../components/QuantyEditor';
import CartColumnVariantsNotes from '../components/CartColumnVariantsNotes';
import DeleteCartOrderButton from '../components/DeleteCartOrderButton';
import TotalPriceCard from '../components/TotalPriceCard';

//NextUI
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button, Link } from '@nextui-org/react';

//Custom Hooks
import useCart from '../hooks/useCart';

const Cart = () => {
  //Context
  const { cartOrders, setCartOrders } = useContext(CartOrdersContext) as CartOrdersContextType;

  //Custom Hook
  const { fetchingRestaurantMenu } = useCart();

  useEffect(() => {
    fetchingRestaurantMenu();
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
      <div className='w-full h-screen flex flex-col justify-between'>
        <Table
          aria-label='CartOrders'
          className={`w-full h-full overflow-auto p-5 ${cartOrders.length === 0 && 'h-1/4'}`}
        >
          <TableHeader>
            <TableColumn>Nombre</TableColumn>
            <TableColumn>Notas / Variantes</TableColumn>
            <TableColumn className='text-center'>Precio Unitario</TableColumn>
            <TableColumn className='text-center'>Cantidad</TableColumn>
            <TableColumn className='text-center'>Total</TableColumn>
            <TableColumn className='text-center'>Acciones</TableColumn>
          </TableHeader>
          <TableBody>
            {cartOrders.map(({ id, name, price = 0, quanty, buttonsValues = [], extras = [], typeOfProduct }) => {
              console.log(quanty);
              return (
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
                  <TableCell>
                    <div className='flex items-center justify-center'>
                      <QuantyEditor id={id} quanty={quanty} buttonsValues={buttonsValues} extras={extras} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-center items-center text-center'>
                      <span className='text-xl text-green-700'>$</span>
                      <div className='w-10 text-center'>
                        <span className='text-medium'>{(price * quanty).toFixed(2)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='flex justify-center items-center p-3'>
                    <DeleteCartOrderButton id={id} quanty={quanty} buttonsValues={buttonsValues} extras={extras} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {cartOrders.length === 0 && (
          <div className=' h-full mx-2 flex flex-col items-center justify-center gap-5 text-4xl'>
            <h1>No hay Articulos en el Carrito ...</h1>
            <Button variant='ghost' className='text-medium' as={Link} href='/menu' color='primary'>
              Ver el Menu
            </Button>
          </div>
        )}
        <div className='border-2 border-gray-300 bg-gray-100 rounded-xl m-2'>
          <TotalPriceCard>
            {cartOrders.reduce((acc, { price, quanty }) => acc + (price || 0) * quanty, 0)}
          </TotalPriceCard>
        </div>
      </div>
    </div>
  );
};

export default Cart;
