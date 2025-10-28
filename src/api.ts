import axios from 'axios';

const api = axios.create({
  // baseURL: '/api'
  baseURL: 'https://movie-server-um7x.onrender.com/api',
  withCredentials: false,
});

// attach token if present
const token = localStorage.getItem('token');
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export function setToken(t: string | null) {
  if (t) {
    localStorage.setItem('token', t);
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  } else {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;

