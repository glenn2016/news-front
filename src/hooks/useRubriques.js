import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rubriqueService } from '../services/rubrique.service';

export const useRubriques = () => {
  return useQuery({
    queryKey:  ['rubriques'],
    queryFn:   rubriqueService.getAll,
    staleTime: 1000 * 60 * 10, // 10 minutes
    select:    (data) => data.data ?? [],
  });
};

export const useCreateRubrique = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rubriqueService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rubriques'] });
    },
  });
};

export const useUpdateRubrique = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => rubriqueService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rubriques'] });
    },
  });
};

export const useDeleteRubrique = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rubriqueService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rubriques'] });
    },
  });
};

export const useRubriquesWithArticles = (limit = 3) => {
  return useQuery({
    queryKey:  ['rubriques-with-articles', limit],
    queryFn:   () => rubriqueService.getWithArticles(limit),
    staleTime: 1000 * 60 * 5,
    select:    (data) => data.data,
  });
};