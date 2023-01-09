import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const REGEX_USERNAME = /^[A-Za-z][A-Za-z0-9_]{4,19}$/;
//minimum 8 chars at least 1 letter, 1 number and 1 special char
const REGEX_PWD = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const Signup = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();



  const [username, setUserName] = useState('');
  const [validUser, setValidUser] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [pwd, setPwd] = useState('');
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState('');
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [success, setSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  useEffect(() => {
    userRef.current.focus();
  }, []);

  //test username Regex
  useEffect(() => {
    setValidUser(REGEX_USERNAME.test(username));
  }, [username]);

  //test pwd Regex
  useEffect(() => {
    setValidPwd(REGEX_PWD.test(pwd));
    setValidMatch(pwd === matchPwd);
  }, [pwd, matchPwd]);

  useEffect(() => {
    setErrMsg('');
  }, [username, pwd, matchPwd]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/signup', {username, pwd},
      {
        headers: {'Content-Type' : 'application/json'},
        withCredentials: true
      });
      console.log(response.data);

      setSuccess(true);
      setUserName('');
      setPwd('');
      setMatchPwd('');
      console.log('success');
    } catch (err) {
      if(!err?.response) {
        setErrMsg('No Server Response');
      } else if (err.response?.status === 409) {
        setErrMsg('Username Taken');
      } else {
        setErrMsg('Registration Failed');
      }
      errRef.current.focus();
    }
  }

  return (
    <section className="login-container container">
      <div className="content-container container">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>

        <h2>Sign up</h2>
        {success ?
          <div className="entry container">
            <span>Successful Sign in</span>
            <Link to="/login">Log In</Link>
          </div>
        :
        <div>
          <form onSubmit={handleSubmit}>
            <div className="entry container">
              <label htmlFor="username">Username:</label>
              <input id="username" name="username" type="text" ref={userRef} value={username} required
              autoComplete="off"
              aria-invalid={!validUser}
              aria-describedby="usernote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              onChange={(e) => {setUserName(e.target.value);}} />
              <p id="usernote" className={userFocus && username && !validUser ? "instructions" : "offscreen"}>
                5 to 20 characters.<br />
                Must start with a letter. Numbers and underscore are also allowed.
              </p>
            </div>


            <div className="entry container">
              <label htmlFor="password">Password:</label>
              <input id="password" name="password" type="password" value={pwd} required
              aria-invalid={!validPwd}
              aria-describedby="pwdnote"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              onChange={(e) => {setPwd(e.target.value);}} />
              <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                At least 8 characters.<br />
                Must have at least 1 letter, 1 number and 1 special character.
              </p>
            </div>

            <div className="entry container">
              <label htmlFor="reenterPwd">Re-enter Password:</label>
              <input id="reenterPwd" name="reenterPwd" type="password" value={matchPwd} required
              aria-invalid={!validMatch}
              aria-describedby="reenterpwdnote"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              onChange={(e) => {setMatchPwd(e.target.value);}} />
              <p id="reenterpwdnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                Must match first password entered.
              </p>
            </div>

            <button className="submit" type="submit" disabled={!validUser || !validPwd || !validMatch}>Sign up</button>
          </form>
        </div>
        }
      </div>
      {!success &&
      <div className="sub-container">
        <p>
          Already registered?
          <span className="link">
          {/*router link here */}
          <Link to="/login">Log In</Link>
          {/* <a href="#" onClick={() => navigate("/login") }>Log in</a> */}
          </span>
        </p>
      </div>
      }
    </section>
  )
}

export default Signup;