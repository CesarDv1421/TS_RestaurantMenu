import { createContext, useState } from 'react';

//Interfaces
import { ContextValue, userInfo } from '../interfaces/AuthContext';
import { ChildrenProps } from '../interfaces/ChildrenProps';

const AuthContext = createContext<ContextValue | null>(null);

const AuthProvider: React.FC<ChildrenProps> = ({ children }) => {
  try {
    const storedToken = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');

    const [userToken, setUserToken] = useState<string | null>(storedToken);
    const [userInfo, setUserInfo] = useState<userInfo | null>(storedUserInfo ? JSON.parse(storedUserInfo) : null);

    const login = (token: string, userInfo: userInfo) => {
      if (token && userInfo) {
        setUserToken(token);
        setUserInfo(userInfo);
        localStorage.setItem('token', token);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      }
    };

    const logout = () => {
      setUserToken(null);
      setUserInfo(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    };

    return <AuthContext.Provider value={{ userToken, userInfo, login, logout }}>{children}</AuthContext.Provider>;
  } catch (err) {
    console.log('Error al analizar el JSON:', err);
    localStorage.removeItem('userInfo');
  }
};

export { AuthContext, AuthProvider };
