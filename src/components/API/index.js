import axios from 'axios';
import { baseURL } from 'Constants/defaultValues';

const defaultOptions = {
    baseURL
};

const instance = axios.create(defaultOptions);

instance.interceptors.response.use( (response) => {
  console.log(response.status)
   return response;
}, (error) => {
  console.log(error.response)
   switch (error.response.status) {
        case 401:
             return error;
             break;
        case 403:
             return error;
            break;
        default:
            return error;
            break;
   }
return Promise.reject(error);
});

export default instance;
