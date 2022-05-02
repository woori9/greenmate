import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const apiInstance = axios.create({
  baseURL: `${API_BASE_URL}`,
  headers: {
    'Content-type': 'application/json',
  },
});
apiInstance.defaults.headers.common.Authorization = `Bearer ${sessionStorage.getItem(
  'Authorization',
)}`;

export default apiInstance;
