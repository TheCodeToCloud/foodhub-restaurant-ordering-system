import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import API, { BACKEND_URL } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('token') || null);
  const [loading, setLoading] = useState(true);

  // Fetch fresh user data from server whenever token changes
  useEffect(() => {
    if (token) {
      API.get('/users/profile')
        .then(res => setUser(res.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  // Handle Login: set token in state & cookies
  const login = (newToken) => {
    Cookies.set('token', newToken, { expires: 7 });
    setToken(newToken);
  };

  // Handle Logout: clear state & cookies
  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
  };

  // Update user data in context (called after profile edit)
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, BACKEND_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};

