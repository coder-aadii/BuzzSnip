import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated on app load
    checkAuthStatus();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const checkAuthStatus = () => {
    try {
      const authenticated = localStorage.getItem('buzzsnip_admin_authenticated');
      const email = localStorage.getItem('buzzsnip_admin_email');
      const loginTime = localStorage.getItem('buzzsnip_login_time');

      if (authenticated === 'true' && email && loginTime) {
        // Check if login is still valid (24 hours)
        const loginDate = new Date(loginTime);
        const now = new Date();
        const hoursDiff = (now - loginDate) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          setIsAuthenticated(true);
          setAdminEmail(email);
        } else {
          // Session expired, clear storage
          logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (email) => {
    setIsAuthenticated(true);
    setAdminEmail(email);
    localStorage.setItem('buzzsnip_admin_authenticated', 'true');
    localStorage.setItem('buzzsnip_admin_email', email);
    localStorage.setItem('buzzsnip_login_time', new Date().toISOString());
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAdminEmail('');
    localStorage.removeItem('buzzsnip_admin_authenticated');
    localStorage.removeItem('buzzsnip_admin_email');
    localStorage.removeItem('buzzsnip_login_time');
  };

  const value = {
    isAuthenticated,
    adminEmail,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;