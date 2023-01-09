import React from 'react';
import { Outlet } from "react-router-dom";
import { useState, useEffect, useContext} from "react";
import useRefreshToken from '../hooks/useRefreshToken.jsx';
import AuthContext from "../context/AuthProvider.jsx";


const PersistentLogin = () => {
  const [loading, setLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useContext(AuthContext);

  useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      try {
        console.log('refreshed')
        await refresh();
      } catch (err) {
        console.error(err);
      } finally {
        console.log(isMounted)
        isMounted && setLoading(false);
      }
    }

    auth?.accessToken ? verifyRefreshToken() : setLoading(false);

    return () => isMounted = false;
  }, []);

  //here to see it working
  useEffect(() => {
    // console.log(`isLoading: ${loading}`)
    // console.log(`auth username: ${auth.username}`)
    // console.log(`auth pwd: ${auth.pwd}`)
    // console.log(`authToken: ${auth?.accessToken}`)
    // console.log("persist", persist);
  }, [loading]);

  return (
    <div>
      {loading
        ? <p>Loading...</p>
        : <Outlet />
      }
    </div>
  )
}

export default PersistentLogin;