import api from '../config/axios';

const getAll = async () => {
  const response = await api.get('/rubriques');
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/rubriques/${id}`);
  return response.data;
};

const create = async (data) => {
  const response = await api.post('/rubriques', data);
  return response.data;
};

const update = async (id, data) => {
  const response = await api.put(`/rubriques/${id}`, data);
  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(`/rubriques/${id}`);
  return response.data;
};

const getWithArticles = async (limit = 3) => {
  const response = await api.get('/rubriques/with-articles', { params: { limit } });
  return response.data;
};

export const rubriqueService = { getAll, getById, create, update, remove ,getWithArticles  };