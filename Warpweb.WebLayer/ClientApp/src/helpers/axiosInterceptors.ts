import axios, { AxiosRequestHeaders } from 'axios';

const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        (request) => {
            const headers: AxiosRequestHeaders = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            };

            const jwtToken = localStorage.getItem('currentUser');

            if (jwtToken) {
                headers['Authorization'] = `Bearer ${jwtToken}`;
            }

            request.headers = headers;

            return request;
        },
        (error) => {
            return Promise.reject(error);
        },
    );
};

export default setupAxiosInterceptors;
