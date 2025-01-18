import axios from 'axios';

const axio = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL:"https://backend-8zgm.onrender.com/" ,
});

export default axio;
