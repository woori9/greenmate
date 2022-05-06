import axios from 'axios';

const API_BASE_URL = 'https://k6b105.p.ssafy.io/api';

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
