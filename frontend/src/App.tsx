import { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

//Interfaces
import { ContextValue } from './interfaces/AuthContext';

//Vistas
import Menu from './views/Menu';
import Auth from './views/Auth';
import Cart from './views/Cart';
import Orders from './views/Orders';

//Context
import { AuthContext } from './context/AuthContext';

const App = () => {
  const { userToken } = useContext(AuthContext) as ContextValue;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={userToken ? <Navigate to='/menu' /> : <Navigate to='/auth' />} />
        <Route path='/auth' element={<Auth />} />
        <Route path='/menu' element={userToken ? <Menu /> : <Navigate to='/auth' />} />
        <Route path='/cart' element={userToken ? <Cart /> : <Navigate to='/auth' />} />
        <Route path='/orders' element={userToken ? <Orders /> : <Navigate to='/auth' />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
