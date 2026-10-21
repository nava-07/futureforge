import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        setToken(storedToken);
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          } catch (e) {
            localStorage.removeItem('user');
          }
        }
        
        // Fetch fresh user data from server
        try {
          const res = await authService.getMe();
          if (res && res.success) {
            setUser(res.data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res && res.success && res.data) {
      const userData = res.data;
      const userToken = userData.token;
      
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(userToken);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } else {
      throw new Error(res?.message || 'Login failed');
    }
  };

  const register = async (formData) => {
    const res = await authService.register(formData);
    if (res && res.success && res.data) {
      const userData = res.data;
      const userToken = userData.token;
      
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(userToken);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } else {
      throw new Error(res?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
