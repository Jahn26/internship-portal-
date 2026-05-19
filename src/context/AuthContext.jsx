import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('hiredeck_token'));
  const [loading, setLoading] = useState(true);

  const syncAuth = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);

    if (nextToken) {
      localStorage.setItem('hiredeck_token', nextToken);
      localStorage.setItem('hiredeck_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('hiredeck_token');
      localStorage.removeItem('hiredeck_user');
    }
  };

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials);
    syncAuth(data.token, data.user);
    toast.success(`Welcome back, ${data.user.name}`);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    syncAuth(data.token, data.user);
    toast.success(`Account created for ${data.user.name}`);
    return data.user;
  };

  const logout = () => {
    syncAuth(null, null);
    toast.success('Logged out');
  };

  const refreshUser = async () => {
    if (!localStorage.getItem('hiredeck_token')) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/me');
      const storedToken = localStorage.getItem('hiredeck_token');
      syncAuth(storedToken, data.user);
    } catch (error) {
      syncAuth(null, null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('hiredeck_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('hiredeck_user');
      }
    }
    refreshUser();
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    login,
    register,
    logout,
    setUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
