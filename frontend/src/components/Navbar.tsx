import { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

//interfaces
import { ContextValue } from '../interfaces/AuthContext';

//Iconos
import Menu from '/img/icons/Menu.png';
import Cart from '/img/icons/Cart.png';
import Promo from '/img/icons/Promo.png';
import LogOut from '/img/icons/LogOut.png';
import ReactIcon from '/img/icons/React.png';

//Context => Token
import { AuthContext } from '../context/AuthContext';

//CSS modules
import css from './Navbar.module.css';

const Navbar = () => {
  const { logout } = useContext(AuthContext) as ContextValue;
  const navigate = useNavigate();

  const listNavbar = [
    { title: null, img: ReactIcon },
    { title: 'Menu', img: Menu, url: '/menu' },
    { title: 'Cart', img: Cart, url: '/cart' },
    { title: 'Orders', img: Promo, url: '/orders' },
    {
      title: '',
      img: LogOut,
      click: () => {
        logout();
        navigate('/auth');
      },
    },
  ];

  return (
    <header className='hidden sm:flex'>
      <nav className='border-r-2 border-gray-300'>
        <ul className={css.ulContainer}>
          {listNavbar.map(({ title, img, click, url }) => {
            return (
              <li key={title} onClick={click ? () => click() : undefined}>
                <Link to={`${url ? url : '/auth'}`} className='flex flex-col items-center'>
                  <img src={img} className={title === null ? 'w-12' : 'w-6'} alt='React logo' width='25px' />
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
