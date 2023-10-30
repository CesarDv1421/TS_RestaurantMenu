import { createContext, useState, useEffect } from 'react';

// Interfaces
import { ContextValue, userInfo } from '../interfaces/AuthContext';

const AuthContext = createContext<ContextValue | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUserInfo = localStorage.getItem('userInfo');

      if (storedToken && storedUserInfo) {
        setUserToken(storedToken);
        setUserInfo(JSON.parse(storedUserInfo));
      }
    } catch (err) {
      console.error('Error al analizar el JSON:', err);
      localStorage.removeItem('userInfo');
    }
  }, []); // Este efecto se ejecutará solo una vez al cargar el componente

  const login = (token: string, info: userInfo) => {
    setUserToken(token);
    setUserInfo(info);
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(info));
  };

  const logout = () => {
    setUserToken(null);
    setUserInfo(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  return <AuthContext.Provider value={{ userToken, userInfo, login, logout }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
