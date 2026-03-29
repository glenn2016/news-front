import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { utilisateurService } from '../services/utilisateur.service';

export const useUtilisateurs = (params = {}) => {
  return useQuery({
    queryKey: ['utilisateurs', params],
    queryFn:  () => utilisateurService.getAll(params),
    staleTime: 1000 * 60 * 5,
    select: (data) => ({
      utilisateurs: data.data,
      pagination:   data.pagination,
    }),
  });
};

export const useUpdateUtilisateur = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => utilisateurService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
  });
};

export const useDeleteUtilisateur = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: utilisateurService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['utilisateurs'] });
    },
  });
};