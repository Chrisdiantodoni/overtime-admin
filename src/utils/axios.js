import axios from 'axios';
const baseURL = process.env.REACT_APP_BASE_URL;

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');
  config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.data.meta.code === 401) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
