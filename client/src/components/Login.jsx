import React, { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthContext from "../context/AuthProvider.jsx";
import axios from 'axios';


const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUserName] = useState('');
  const [pwd, setPwd] = useState('');
  const [errMsg, setErrMsg] = useState('');



  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/login', {username, pwd},
      {
        headers: {'Content-Type' : 'application/json'},
        withCredentials: true
      });

      const accessToken = response?.data?.accessToken;
      console.log(accessToken);
      setAuth({username, pwd, accessToken});
      setUserName('');
      setPwd('');
      //redirect to view if success
      navigate(from, {replace : true});
    } catch (err) {
      if(!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
        setErrMsg('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setErrMsg('User Unauthorized');
      } else {
        setErrMsg('Login Failed! Please re-enter username and password');
      }
      errRef.current.focus();
    }
  }

  return (
    <section className="login-container container">
      <div className="content-container container">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>


        <h2>Login for High Scores!</h2>

        <form onSubmit={handleSubmit}>
          <div className="entry container">
            <label htmlFor="username"> Username: </label>
            <input id="username" name="username" type="text" ref={userRef} value={username} required onChange={(e) => {
              setUserName(e.target.value);
            }}/>
          </div>

          <div className="entry container">
            <label htmlFor="password" >Password:</label>
            <input id="password" name="password" type="password" required value={pwd} onChange={(e) => {
              setPwd(e.target.value);
            }}/>
          </div>

          <button className="submit" type="submit">Log in</button>
        </form>
      </div>

      <div className="sub-container">
        <p>
          Need an Account?
            <span className="link">
            {/*router link here */}
            <Link to="/signup">Sign Up</Link>
            {/* <a href="#" onClick={() => navigate("/signup") }>Sign Up</a> */}
            </span>
        </p>
      </div>
    </section>
  )
}

export default Login;