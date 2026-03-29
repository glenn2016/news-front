import api from '../config/axios';

const getAll = async (params) => {
  const response = await api.get('/articles', { params });
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/articles/${id}`);
  return response.data;
};

const create = async (data) => {
  const response = await api.post('/articles', data);
  return response.data;
};

const update = async (id, data) => {
  const response = await api.put(`/articles/${id}`, data);
  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(`/articles/${id}`);
  return response.data;
};

const search = async (params) => {
  const response = await api.get('/search', { params });
  return response.data;
};

const getSimilaires = async (id) => {
  const response = await api.get(`/articles/${id}/similaires`);
  return response.data;
};

export const articleService = { getAll, getById, create, update, remove, search ,getSimilaires  };