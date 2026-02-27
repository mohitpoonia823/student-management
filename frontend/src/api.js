import axios from 'axios';

console.log('API URL:', process.env.REACT_APP_API_URL);

const BaseUrl = `${process.env.REACT_APP_API_URL}/api`;

const API = axios.create({ baseURL: BaseUrl });

const API = axios.create({ baseURL: '/api' });

export const getStudents = (params) => API.get('/students', { params });
export const getStudent = (id) => API.get(`/students/${id}`);
export const createStudent = (data) => API.post('/students', data);
export const updateStudent = (id, data) => API.put(`/students/${id}`, data);
export const deleteStudent = (id) => API.delete(`/students/${id}`);
export const getStats = () => API.get('/students/stats');
