import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//Interfaces
import { CartOrdersContextType } from '../interfaces/CartOrder';
import { ContextValue } from '../interfaces/AuthContext';

//Componentes
import RestaurantMenu from '../components/RestaurantMenu';
import CartMenu from '../components/CartMenu';
import SliderCategories from '../components/SliderCategories';
import Navbar from '../components/Navbar';

//Iconos
import Cart from '/img/icons/Cart.png';
import Menu from '/img/icons/Menu.png';

//Context
//=> token
import { AuthContext } from '../context/AuthContext.tsx';
//=> CartOrder / Carrito de compras
import { CartOrdersContext } from '../context/CartOrdersContext.tsx';

//Material UI
import { Grid } from '@mui/material';

//Next UI
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@nextui-org/react'; //Componentes necesarios para el Modal
import { Badge, Button, Input } from '@nextui-org/react'; //Circulo de notificaciones

//Custom Hooks
import useMenu from '../hooks/useMenu.tsx';

//CSS Modules
import css from '../components/Menu.module.css';

function App() {
  //Estados
  const [inputValue, setInputValue] = useState('');

  //Context
  //=> CartOrder / Carrito de compras
  const { cartOrders, setCartOrders } = useContext(CartOrdersContext) as CartOrdersContextType;
  //=> Token, informacion del usuario y cierre de sesion
  const { userInfo, userToken } = useContext(AuthContext) as ContextValue;

  //Hooks
  const navigate = useNavigate();
  //=> Custom Hooks
  const { isOpen, onOpen, onClose } = useDisclosure(); //custom Hook del Modal del NextUI

  const {
    fetchMenuRestaurant,
    onFindingMenu,
    onGoToCart,
    categories,
    displayedCategory,
    setDisplayedCategory,
    restaurantMenu,
    setRestaurantMenu,
    copyOfRestaurantMenu,
  } = useMenu();

  useEffect(() => {
    if (!userToken) navigate('/auth');
  }, [userToken]);

  useEffect(() => {
    // Al cargar el componente, cargar el carrito desde el localStorage
    const storedCart = localStorage.getItem('cartOrders');

    if (storedCart) {
      try {
        setCartOrders(JSON.parse(storedCart));
      } catch (err) {
        localStorage.removeItem('cartOrders');
        console.log('Error al analizar el JSON:', err);
      }
    }
  }, []);

  useEffect(() => {
    if (userToken) fetchMenuRestaurant();
    else navigate('/auth');
  }, []);

  useEffect(() => {
    // Al cambiar el carrito, actualizar el localStorage
    const storedCart = localStorage.getItem('cartOrders');
    if (storedCart) localStorage.setItem('cartOrders', JSON.stringify(cartOrders));
  }, [cartOrders]);

  useEffect(() => {
    setRestaurantMenu(() => {
      return displayedCategory !== 'Menu' //Cuando se seleccione cualquier boton que no sea "Menu" de las categorias
        ? copyOfRestaurantMenu.current?.filter(({ category }) => category === displayedCategory)
        : copyOfRestaurantMenu.current;
    });
  }, [displayedCategory, copyOfRestaurantMenu]); //Cada vez que se seleccione una categoria

  return (
    <div className='flex'>
      <Navbar />

      <main className='flex flex-col h-screen overflow-auto w-full'>
        <section className='border-2 border-gray-300 mx-2 mt-2 mb-1 rounded-lg'>
          <div className={css.ChosseCategoryContainer}>
            <h1 className='hidden md:inline'>Bienvenido, {userInfo?.userName}</h1>
            <img src={Menu} alt='Menu Icon' className='w-5  sm:hidden' />

            <div className='w-1/2'>
              {/* <input type='text' placeholder='Buscar categoria o menu' /> */}
              <Input
                className='border-2 border-gray-300 rounded-lg'
                size='sm'
                type='text'
                label='Buscar plato del menu'
                value={inputValue}
                onValueChange={setInputValue}
                onChange={onFindingMenu}
              />
            </div>

            <div className='flex transform hover:scale-125 transition duration-1000 active:scale-100'>
              <Badge
                className='cursor-pointer'
                content={cartOrders.length > 0 ? cartOrders.length : false}
                isInvisible={cartOrders.length === 0}
                color='danger'
              >
                <img src={Cart} alt='Cart logo' onClick={() => onOpen()} className='w-6 sm:w-9 cursor-pointer' />
              </Badge>
            </div>

            <Modal
              backdrop='blur'
              scrollBehavior='inside'
              isOpen={isOpen}
              onClose={onClose}
              placement='center'
              size='3xl'
              shadow='sm'
              classNames={{
                wrapper: 'overflow-hidden',
                backdrop: 'bg-[#292f47]/50 backdrop-opacity-40',
                header: 'border-b-2 border-gray-300',
                footer: 'border-t-2 border-gray-300',
              }}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className='flex flex-col gap-1'>
                      <div className='flex justify-between items-center'>
                        <h1 className='text-2xl'>Carrito</h1>
                      </div>
                    </ModalHeader>
                    <ModalBody>
                      <div className='flex flex-col h-[1000rem] gap-6 py-2 pl-3 pr-2 w-full overflow-y-scroll'>
                        {cartOrders?.length === 0 ? (
                          <span className='w-full h-full flex justify-center items-center text-4xl'>
                            Sin pedidos... ¡Ordena Ya!
                          </span>
                        ) : (
                          cartOrders.map(
                            ({ id, name, quanty, price, buttonsValues, extras, typeOfProduct, img }, index) => (
                              <CartMenu
                                key={`${id}-${name}-${index}`}
                                id={id}
                                name={name}
                                quanty={quanty}
                                price={price}
                                typeOfProduct={typeOfProduct}
                                buttonsValues={buttonsValues}
                                extras={extras}
                                img={img}
                              >
                                {typeOfProduct === 'Custom' && <h1 className='mb-2'>Sin:</h1>}

                                {buttonsValues &&
                                  Object.values(buttonsValues).map(({ title, ingredient }) => {
                                    return (
                                      <div key={ingredient}>
                                        {typeOfProduct === 'Coffee' && title} {ingredient}
                                      </div>
                                    );
                                  })}

                                {extras && extras.length > 0 && (
                                  <>
                                    <h1 className='my-2'>Extra de:</h1>
                                    {Object.values(extras)?.map(({ ingredient, price }) => {
                                      return (
                                        <div key={ingredient}>
                                          - {ingredient} (+${price})
                                        </div>
                                      );
                                    })}
                                  </>
                                )}
                              </CartMenu>
                            )
                          )
                        )}
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      {/* <TotalPriceCard onClose={onClose}>
                        {cartOrders.reduce((acc, { price, quanty }) => acc + price * quanty, 0)}
                      </TotalPriceCard> */}
                      <div className='flex mx-5 gap-5'>
                        {cartOrders?.length === 0 ? (
                          <Button className='w-full' color='success' variant='ghost' onClick={onClose}>
                            <div className='px-10'>Ver Menu ...</div>
                          </Button>
                        ) : (
                          <Button className='w-full' color='success' variant='ghost' onClick={onGoToCart}>
                            <div className='px-10'>Ir al Carrito de Compras</div>
                          </Button>
                        )}
                      </div>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </section>

        <section className='overflow-y-scroll h-full bg-gray-100 mx-2 mb-2 mt-1 border-2 border-gray-300 rounded-lg'>
          <SliderCategories categories={categories} setDisplayedCategory={setDisplayedCategory} />
          <h1 className='m-5 text-2xl'>{displayedCategory === 'Menu' ? 'Menu' : `${displayedCategory} Menu`}</h1>
          <div className='p-5'>
            <Grid container spacing={5} alignItems='center'>
              {restaurantMenu?.map(
                ({
                  id,
                  name,
                  description,
                  price,
                  quanty,
                  img,
                  category,
                  typeOfProduct,
                  variants,
                  ingredients,
                  extras,
                }) => {
                  return (
                    <Grid key={id} item xs={12} sm={6} md={6} lg={4}>
                      <RestaurantMenu
                        id={id}
                        name={name}
                        description={description}
                        price={price}
                        img={`http://localhost:3000/img/restaurantImg/${img}`}
                        category={category}
                        variants={variants}
                        ingredients={ingredients}
                        extras={extras}
                        quanty={quanty}
                        typeOfProduct={typeOfProduct}
                      />
                    </Grid>
                  );
                }
              )}
            </Grid>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
