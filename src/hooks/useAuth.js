import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/auth.service';

export const useLogin = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: ({ data }) => {
      login(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        data.utilisateur
      );
      navigate('/');
    },
  });
};

export const useRegister = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: ({ data }) => {
      login(
        { accessToken: data.accessToken, refreshToken: data.refreshToken },
        data.utilisateur
      );
      navigate('/');
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate   = useNavigate();

  return useMutation({
    mutationFn: authService.logout,
    onSuccess: async () => {
      await logout();
      navigate('/login');
    },
  });
};