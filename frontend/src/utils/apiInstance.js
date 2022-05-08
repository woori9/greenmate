import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const apiInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-type': 'application/json',
  },
});
apiInstance.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem(
  'Authorization',
)}`;

apiInstance.interceptors.response.use(
  res => {
    return res;
  },
  async err => {
    const originalConfig = err.config;
    const statusCode = err.response.status;
    const errMsg = err.response.data;
    if (errMsg === 'EXPIRED_TOKEN') {
      originalConfig.retry = true;
      try {
        const res = await apiInstance.get('/accounts/token/', {
          headers: {
            Refresh: `${sessionStorage.getItem('Refresh')}`,
          },
        });
        sessionStorage.setItem('Authorization', res.data.access_token);
        sessionStorage.setItem('Refresh', res.data.refresh_token);
      } catch {
        console.log(err);
      }
    } else {
      console.log(statusCode);
    }
  },
);

export default apiInstance;
