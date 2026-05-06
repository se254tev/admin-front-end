import apiClient from './axios';

export const loginAdmin = async ({ email, password }) => {
  const response = await apiClient.post('/admin/login', { email, password });
  return response.data;
};

export const fetchDashboardMetrics = async () => {
  const response = await apiClient.get('/admin/dashboard');
  return response.data;
};

export const fetchMenuItems = async (params = {}) => {
  const response = await apiClient.get('/admin/menu', { params });
  return response.data;
};

export const createMenuItem = async (payload) => {
  const finalPayload = {
    name: payload.name,
    description: payload.description,
    category: payload.category,
    price: payload.price,
    image: payload.image,
    inStock: payload.inStock,
  };
  console.log('Sending createMenuItem payload:', finalPayload);
  const response = await apiClient.post('/admin/menu', finalPayload);
  return response.data;
};

export const updateMenuItem = async (id, payload) => {
  const finalPayload = {
    name: payload.name,
    description: payload.description,
    category: payload.category,
    price: payload.price,
    image: payload.image,
    inStock: payload.inStock,
  };
  console.log('Sending updateMenuItem payload:', finalPayload);
  const response = await apiClient.put(`/admin/menu/${id}`, finalPayload);
  return response.data;
};

export const deleteMenuItem = async (id) => {
  const response = await apiClient.delete(`/admin/menu/${id}`);
  return response.data;
};

export const fetchOrders = async () => {
  const response = await apiClient.get('/admin/orders');
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.put(`/admin/orders/${id}`, { status });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await apiClient.delete(`/admin/orders/${id}`);
  return response.data;
};

export const fetchUsers = async (params = {}) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const updateUserStatus = async (id, payload) => {
  const response = await apiClient.put(`/admin/users/${id}`, payload);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
};

export const fetchCategories = async () => {
  const response = await apiClient.get('/admin/categories');
  return response.data;
};

export const createCategory = async (payload) => {
  const response = await apiClient.post('/admin/categories', payload);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/admin/categories/${id}`);
  return response.data;
};
