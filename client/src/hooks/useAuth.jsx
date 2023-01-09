import React, { useContext } from "react";
import AuthContext from "../context/AuthProvider.jsx";

//not in use at moment
const useAuth = () => {
  return useContext(AuthContext);

}

export default useAuth;