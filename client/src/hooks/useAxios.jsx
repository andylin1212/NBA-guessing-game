import axios from 'axios';
import { useEffect, useContext } from 'react';
import AuthContext from "../context/AuthProvider.jsx";
import useRefreshToken from './useRefreshToken.jsx';
const BASE_URL = 'http:localhost:3333';

const axiosPrivate = axios.create({
  // baseURL: BASE_URL,
  headers: {'Content-Type' : 'application/json'},
  withCredentials: true
});

export function useAxiosAuthed () {
  const { auth } =  useContext(AuthContext);
  const refresh = useRefreshToken();

  useEffect(() => {

    const reqIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.accessToken}`;
        }
        return config;
      },
      (err) => Promise.reject(err)
    )
    const resIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (err) => {
        const prev = err?.config;
        if (err?.response?.status === 403 && !prev?.sent) {
          prev.sent = true;
          const newAccessToken = await refresh();
          prev.headers[ 'Authorization' ] = `Bearer ${newAccessToken}`;
          return axiosPrivate(prev);
        }
        return Promise.reject(err);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(reqIntercept);
      axiosPrivate.interceptors.response.eject(resIntercept);
    }
  }, [ auth, refresh]);

  return axiosPrivate;
};

export default axios.create({
   baseURL: BASE_URL
});
