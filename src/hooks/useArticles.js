import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService } from '../services/article.service';

// ─── Liste des articles avec filtres et pagination ─────────────
export const useArticles = (params = {}) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn:  () => articleService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 minutes de cache
    select: (data) => ({
      articles:   data.data,
      pagination: data.pagination,
    }),
  });
};

// ─── Un seul article par ID ────────────────────────────────────
export const useArticle = (id) => {
  return useQuery({
    queryKey: ['articles', id],
    queryFn:  () => articleService.getById(id),
    enabled:  !!id,
    staleTime: 1000 * 60 * 5,
    select: (data) => data.data,
  });
};

// ─── Mutations dashboard ───────────────────────────────────────
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articleService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

// ─── useUpdateArticle ───────────────────────────────────────
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => articleService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

// ─── useDeleteArticle ───────────────────────────────────────
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articleService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

// ─── Meilisearch ──────────────────────────────────────────────
export const useSearch = (query, params = {}) => {
  return useQuery({
    queryKey:  ['search', query, params],
    queryFn:   () => articleService.search({ q: query, ...params }),
    enabled:   !!query && query.trim().length > 0,
    staleTime: 1000 * 30,
    select: (data) => ({
      articles:   data.data,
      pagination: data.pagination,
    }),
  });
};

// ─── Similaires  ──────────────────────────────────────────────
export const useSimilaires = (id) => {
  return useQuery({
    queryKey:  ['similaires', id],
    queryFn:   () => articleService.getSimilaires(id),
    enabled:   !!id,
    staleTime: 1000 * 60 * 5,
    select:    (data) => data.data,
  });
};