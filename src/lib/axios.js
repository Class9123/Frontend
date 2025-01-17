import axios from 'axios';

const axio = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL:"https://backend-22cx.onrender.com/" ,
});

export default axio;
