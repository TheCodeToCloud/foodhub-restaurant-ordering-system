import React, { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get('token') || null);
  const [loading, setLoading] = useState(true);

  // Re-hydrate user state if a token exists
  useEffect(() => {
    if (token) {
      try {
        // Since JWTs are base64Url encoded in the payload (2nd part), 
        // we can decode it on the frontend to get user info (id, email, role).
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        setUser(decoded);
      } catch (err) {
        console.error("Failed to decode token", err);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  // Handle Login: set token in state & cookies, which triggers the useEffect
  const login = (newToken) => {
    Cookies.set('token', newToken, { expires: 7 }); // expires in 7 days
    setToken(newToken);
  };

  // Handle Logout: clear state & cookies
  const logout = () => {
    Cookies.remove('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
