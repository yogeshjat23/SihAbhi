import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, role: null });

  const login = (role, password) => {
    // Assuming API has validated the credentials and role
    if (role === 'admin' || role === 'client' ) {
      setAuth({ isAuthenticated: true, role });
      return true;
    }
    return false;
  };

  const logout = () => setAuth({ isAuthenticated: false, role: null });

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

