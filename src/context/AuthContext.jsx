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
    setToken(null);
    setUser(null);
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
