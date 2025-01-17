import axios from 'axios';

const axio = axios.create({
  baseURL:"http://localhost:5000" ,//"https://backend-22cx.onrender.com/" ,//'http://localhost:5000
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axio;