
import axios from 'axios';

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
  headers: {'Content-Type': 'application/json'}
});

export default api;
