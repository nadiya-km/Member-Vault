import api from '../services/api';

export const getPlans = () => api.get('/membership-plan');

export const createPlan = (data) => api.post('/membership-plan', data);

export const updatePlan = (id, data) => api.put(`/membership-plan/${id}`, data);

export const deletePlan = (id) => api.delete(`/membership-plan/${id}`);
