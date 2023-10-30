import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

//Interfaces
import { ContextValue } from '../interfaces/AuthContext';
import { CartOrderTypes, CartOrdersContextType } from '../interfaces/CartOrder';

//Context
import { AuthContext } from '../context/AuthContext';
import { CartOrdersContext } from '../context/CartOrdersContext';

//API URL
const API_URL = import.meta.env.VITE_API_URL;

const useMenu = () => {
  const [restaurantMenu, setRestaurantMenu] = useState<CartOrderTypes[]>(); //Aqui se almacena el menu del restaurante
  const copyOfRestaurantMenu = useRef<CartOrderTypes[]>([]);
  const [categories, setCategories] = useState([]); //Aqui se almacenan las categorias de los platillos
  const [displayedCategory, setDisplayedCategory] = useState('Menu'); //Mustra el menu de acuerdo a la categoria selecionada

  const navigate = useNavigate();

  const { cartOrders } = useContext(CartOrdersContext) as CartOrdersContextType;
  const { userToken, logout } = useContext(AuthContext) as ContextValue;

  const fetchMenuRestaurant = async () => {
    try {
      const response = await fetch(`${API_URL}/menu`, {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${userToken}`,
        },
      });
      const { menu, categories, err } = await response.json();

      if (err) {
        logout();
        console.log(err);
        navigate('/auth');
      }

      if (response.status === 200) {
        setRestaurantMenu(menu);
        copyOfRestaurantMenu.current = menu;
        setCategories(categories);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onFindingMenu = (event: React.ChangeEvent<HTMLInputElement>) => {
    //Muestra el menu de acuerdo a lo escrito
    const inputValue = event.target.value;

    if (inputValue.length > 0) setDisplayedCategory('Menu');

    const filteredFood = copyOfRestaurantMenu.current.filter((food) =>
      food.name.toLowerCase().includes(inputValue.toLocaleLowerCase())
    );
    return setRestaurantMenu(filteredFood);
  };

  const onGoToCart = () => {
    localStorage.setItem('cartOrders', JSON.stringify(cartOrders));
    navigate('/cart');
  };

  return {
    fetchMenuRestaurant,
    onGoToCart,
    onFindingMenu,
    restaurantMenu,
    setRestaurantMenu,
    categories,
    displayedCategory,
    setDisplayedCategory,
    copyOfRestaurantMenu,
  };
};

export default useMenu;
