import apiClient from './axios';

export const loginAdmin = async ({ username, password }) => {
  const response = await apiClient.post('/api/admin/login', { username, password });
  return response.data;
};

export const fetchDashboardMetrics = async () => {
  const response = await apiClient.get('/api/admin/dashboard');
  return response.data;
};

export const fetchMenuItems = async (params = {}) => {
  const response = await apiClient.get('/api/admin/menu', { params });
  return response.data;
};

export const createMenuItem = async (payload) => {
  const response = await apiClient.post('/api/admin/menu', payload);
  return response.data;
};

export const updateMenuItem = async (id, payload) => {
  const response = await apiClient.put(`/api/admin/menu/${id}`, payload);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await apiClient.delete(`/api/admin/menu/${id}`);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await apiClient.get('/api/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.put(`/api/admin/orders/${id}`, { status });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await apiClient.delete(`/api/admin/orders/${id}`);
  return response.data;
};

export const fetchUsers = async (params = {}) => {
  const response = await apiClient.get('/api/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (id, payload) => {
  const response = await apiClient.put(`/api/admin/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/api/admin/users/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get('/api/admin/categories');
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await apiClient.post('/api/admin/categories', payload);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/api/admin/categories/${id}`);
  return response.data;
};
