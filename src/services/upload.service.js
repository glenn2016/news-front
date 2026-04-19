import api from '../config/axios';

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

const deleteImage = async (imageUrl) => {
  const response = await api.delete('/upload', { data: { imageUrl } });
  return response.data;
};

export const uploadService = { uploadImage, deleteImage };