import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const getProtectedData = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/protected`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getUsers = () => axios.get('/admin/users');
export const createUser = (data) => axios.post('/admin/users', data);
export const updateUser = (id, data) => axios.put(`/admin/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`/admin/users/${id}`);

export const getGroups = () => axios.get('/admin/groups');
export const createGroup = (data) => axios.post('/admin/groups', data);
export const updateGroup = (id, data) => axios.put(`/admin/groups/${id}`, data);
export const deleteGroup = (id) => axios.delete(`/admin/groups/${id}`);

export const getDisciplines = () => axios.get('/admin/disciplines');
export const createDiscipline = (data) => axios.post('/admin/disciplines', data);
export const updateDiscipline = (id, data) => axios.put(`/admin/disciplines/${id}`, data);
export const deleteDiscipline = (id) => axios.delete(`/admin/disciplines/${id}`);