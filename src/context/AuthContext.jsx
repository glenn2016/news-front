import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifie si l'user est connecté au démarrage
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/auth/me')
        .then(({ data }) => setUser(data.data.utilisateur))
        .catch(() => {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (tokens, utilisateur) => {
    localStorage.setItem('accessToken',  tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setUser(utilisateur);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin         = user?.role === 'admin';
  const isRedacteur     = user?.role === 'redacteur' || isAdmin;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin, isRedacteur }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);