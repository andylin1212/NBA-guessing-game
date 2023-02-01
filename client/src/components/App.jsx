import React, {useState, useEffect} from 'react';
import Home from '../components/Home.jsx';
import Signup from '../components/Signup.jsx'
import Login from '../components/Login.jsx';
import Dashboard from '../components/Dashboard.jsx';
import PersistentLogin from '../components/PersistentLogin.jsx';
import PassedAuth from '../components/PassedAuth.jsx';
import FourOFour from '../components/404.jsx';
import { Routes, Route} from 'react-router-dom';



var App = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />}>
        {/*public routes*/}
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="unauthorized" element={<FourOFour />} />

        {/*protected routes*/}
        {/* <Route element={<PersistentLogin />}> */}
          <Route element={<PassedAuth />}>
            <Route path="/" element={<Home />} />
          </Route>
        {/* </Route> */}

        {/*Catch all essentially a 404 page*/}


      </Route>
    </Routes>

  )

}

export default App;