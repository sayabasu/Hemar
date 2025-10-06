import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../../lib/api.js';

const AuthContext = createContext(null);

const tokenKey = 'hemar_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey));

  useEffect(() => {
    if (token) {
      api
        .get('/auth/profile')
        .then((res) => setUser(res.data.user))
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem(tokenKey);
        });
    }
  }, [token]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const {
      data: {
        user: loggedUser,
        token: { token: authToken },
      },
    } = response;
    setUser(loggedUser);
    setToken(authToken);
    localStorage.setItem(tokenKey, authToken);
    setAuthToken(authToken);
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    const {
      data: {
        user: registeredUser,
        token: { token: authToken },
      },
    } = response;
    setUser(registeredUser);
    setToken(authToken);
    localStorage.setItem(tokenKey, authToken);
    setAuthToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(tokenKey);
    setAuthToken(null);
  };

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
