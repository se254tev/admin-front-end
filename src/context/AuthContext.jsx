import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      setUser({ role: 'admin' });
    }
  }, [token]);

  const clearAuthState = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_token');
    sessionStorage.removeItem('admin_token');
  };

  const login = async (credentials) => {
    setLoading(true);
    const data = await loginAdmin(credentials);
    setToken(data.token);
    localStorage.setItem('admin_token', data.token);
    setUser({ role: 'admin' });
    setLoading(false);
    navigate('/admin/dashboard');
  };

  const logout = () => {
    clearAuthState();
    navigate('/admin/login');
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      clearAuthState();
    };

    const handleStorage = (event) => {
      if (event.key === 'admin_token' && !event.newValue) {
        clearAuthState();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
