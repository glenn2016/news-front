import api from '../config/axios';

const getAll = async (params) => {
  const response = await api.get('/utilisateurs', { params });
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/utilisateurs/${id}`);
  return response.data;
};

const update = async (id, data) => {
  const response = await api.put(`/utilisateurs/${id}`, data);
  return response.data;
};

const remove = async (id) => {
  const response = await api.delete(`/utilisateurs/${id}`);
  return response.data;
};

export const utilisateurService = { getAll, getById, update, remove };