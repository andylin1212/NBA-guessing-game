import axios from 'axios';
import useAuth from './useAuth.jsx';
import AuthContext from "../context/AuthProvider.jsx";
import { useContext } from "react";

function useRefreshToken() {
  const { setAuth } = useContext(AuthContext);

  const refresh = async () => {
    const response = await axios.get('/refresh', {
      withCredentials: true
    });
    const newAccessToken = response.data.accessToken;
    setAuth((previous) => {
      console.log(JSON.stringify(previous));
      console.log(response.data.accessToken);
      return { ...previous, accessToken: newAccessToken }
    });
    return newAccessToken;
  }
  return refresh;
}

export default useRefreshToken;