import api from '../services/api';

export const getPlans = () => api.get('/membership-plans');

export const createPlan = (data) => api.post('/membership-plans', data);

export const updatePlan = (id, data) => api.put(`/membership-plans/${id}`, data);

export const deletePlan = (id) => api.delete(`/membership-plans/${id}`);
