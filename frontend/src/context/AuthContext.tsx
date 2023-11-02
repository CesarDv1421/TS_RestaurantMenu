import React, { createContext, useState, useEffect } from 'react';

//Interfaces
import { ContextValue, userInfo } from '../interfaces/AuthContext';

const AuthContext = createContext<ContextValue | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(localStorage.getItem('token'));
  const [userInfo, setUserInfo] = useState<userInfo | null>(null);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUserInfo = localStorage.getItem('userInfo');
      const parsedUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

      if (storedToken && parsedUserInfo) {
        setUserToken(storedToken);
        setUserInfo(parsedUserInfo);
      }
    } catch (error) {
      console.error('Error al recuperar datos de autenticación:', error);
    }
  }, []);

  const login = (token: string, userInfo: userInfo) => {
    setUserToken(token);
    setUserInfo(userInfo);
    localStorage.setItem('token', token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logout = () => {
    setUserToken(null);
    setUserInfo(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
  };

  console.log(userToken);

  return <AuthContext.Provider value={{ userToken, userInfo, login, logout }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
