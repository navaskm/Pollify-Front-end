import axios from "axios";

// TO CREATE A SINGLE INSTANCE
const api = axios.create({baseURL: '/api'});

// TO ATTACH JWT TOKEN TO ANY REQUEST
api.interceptors.request.use(config => {

  if(typeof window !== 'undefined'){
    const token = localStorage.getItem("token");

    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;