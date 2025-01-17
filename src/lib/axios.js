import axios from 'axios';

const axio = axios.create({
  baseURL:"https://backend-22cx.onrender.com/" ,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axio;