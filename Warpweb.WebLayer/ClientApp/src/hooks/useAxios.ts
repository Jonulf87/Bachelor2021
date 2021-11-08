import axios, { AxiosInstance } from 'axios';
import useAuth from './useAuth';

const useAxios = (): AxiosInstance => {

    const { token } = useAuth();
    const axiosInstance = axios.create();

    axiosInstance.interceptors.request.use(
        async (config) => {
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        },
        (error) => {
            Promise.reject(error);
        }
    );

    return axiosInstance;
}

export default useAxios;