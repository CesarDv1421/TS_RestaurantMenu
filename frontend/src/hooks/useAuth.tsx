import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

//API URL
const VITE_API_URL = import.meta.env.VITE_API_URL;

interface userInfo {
  userName: string;
  rol: string;
}

interface ContextValue {
  userToken: string | null;
  userInfo: userInfo | null;
  login: (token: string, userInfo: userInfo) => void;
  logout: () => void;
}

interface SnackbarTypes {
  type: string;
  styles: string;
  message: string;
}

const useAuth = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [typeOfAuth, setTypeOfAuth] = useState('Signin'); // Estado para manejar el TAB de NextUI, cambia entre Sign in / Sign Up
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errMessage, setErrMessage] = useState<SnackbarTypes>();
  const navigate = useNavigate();

  //Context ==> token
  const { userToken, login, logout } = useContext(AuthContext) as ContextValue;

  useEffect(() => {
    if (userToken) return navigate('/menu');
  }, [userToken]);

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const inputErrMessage = (type: string, styles: string, message: string) => {
    setErrMessage({ type: type, styles: styles, message: message });

    setTimeout(() => {
      setErrMessage({ type: '', styles: '', message: '' });
    }, 2000);
  };

  const onSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!email) return inputErrMessage('Email', 'invalid', 'El email es requerido');

    if (!password) return inputErrMessage('Password', 'invalid', 'La contraseña es requerida');

    try {
      const response = await fetch(`${VITE_API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const { token, userName, rol, err } = await response.json();

      if (err) {
        logout();
        setErrMessage({ type: 'Server', styles: 'invalid', message: err });
        return console.log(err);
      }
      if (response.status === 201) {
        login(token, { userName, rol });
        navigate('/menu');
      }
    } catch (err: any) {
      setErrMessage({
        type: 'Server',
        styles: 'invalid',
        message: err,
      });
      console.log(err);
    }
  };

  const onSignUp = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!name) return inputErrMessage('Name', 'invalid', 'El nombre es requerido');

    if (!email) return inputErrMessage('Email', 'invalid', 'El email es requerido');

    if (!password) return inputErrMessage('Password', 'invalid', 'La contraseña es requerida');

    try {
      const response = await fetch(`${VITE_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const { token, userName, rol, err } = await response.json();

      console.log(token, userName, rol, err);

      if (err) {
        logout();
        setErrMessage({ type: 'Server', styles: 'invalid', message: err });
        return console.log(err);
      }
      if (response.status === 201) {
        login(token, { userName, rol });
        navigate('/menu');
      }
    } catch (err) {
      setErrMessage({
        type: 'Server',
        styles: 'invalid',
        message: 'Ha ocurrido un error en el Servidor, intente mas tarde',
      });
      console.log(err);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    errMessage,
    setErrMessage,
    typeOfAuth,
    setTypeOfAuth,
    onSignIn,
    onSignUp,
    toggleVisibility,
    isPasswordVisible
  };
};

export default useAuth;
