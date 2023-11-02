import { createContext, useContext, ReactNode } from 'react';

// Interfaces
import { ContextValue, userInfo } from '../interfaces/AuthContext';

// Crea el contexto de autenticación
const AuthContext = createContext<ContextValue | null>(null);

// Proveedor de autenticación utilizando localStorage
const AuthProvider = ({ children }: { children: ReactNode }) => {
  let userToken: string | null = null;
  let userInfo: userInfo | null = null;

  try {
    const storedToken = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');
    const parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

    userToken = storedToken;
    userInfo = parsedUserInfo;
  } catch (err) {
    console.log(err);
  }

  const login = (token: string, userInfo: userInfo) => {
    userToken = token;
    userInfo = userInfo;
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logout = () => {
    userToken = null;
    userInfo = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  if (userToken === null || userInfo === null) {
    // Puedes mostrar un mensaje de error o redirigir al usuario en caso de un error de autenticación
    return <div>Error de autenticación</div>;
  }

  return <AuthContext.Provider value={{ userToken, userInfo, login, logout }}>{children}</AuthContext.Provider>;
};

// Función personalizada para utilizar el contexto de autenticación
const useAuth = (): ContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  return context;
};

export { AuthProvider, useAuth, AuthContext };
