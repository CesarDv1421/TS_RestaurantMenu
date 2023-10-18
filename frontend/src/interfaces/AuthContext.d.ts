interface userInfo {
  userName: string;
  rol: string;
}

export interface ContextValue {
  userToken: string | null;
  userInfo: userInfo | null;
  login: (token: string, userInfo: userInfo) => void;
  logout: () => void;
}
