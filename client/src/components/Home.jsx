import React, { useState, useEffect, useRef, useContext } from 'react';
import searchNBAstats from '../lib/searchNBAstats.jsx';
import exampleNBAdata from '../data/exampleNBAdata.jsx';
import Input from '../components/Input.jsx';
import GuessTable from '../components/GuessTable.jsx';
import { useNavigate, useLocation } from "react-router-dom";
import { useAxiosAuthed } from '../hooks/useAxios.jsx';
import axios from 'axios';
import AuthContext from "../context/AuthProvider.jsx"; // testing


const Home = () => {
  const errRef = useRef();
  const { auth } = useContext(AuthContext); //testing
  const players = [];
  const [ifSuccess, setIfSuccess] = useState('unsure');
  const [currGuess, setCurrGuess] = useState("");
  const [allGuesses, setAllGuesses] = useState([]);
  const [count, setCount] = useState(1);
  const [playerDatabase, setPlayerDatabase] = useState(exampleNBAdata);
  const [playerNames, setPlayerNames] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState({});
  const [errMsg, setErrMsg] = useState('');
  const [isHintShowing, setIsHintShowing] = useState(false);

  const axiosAuthed = useAxiosAuthed();

  function addGuess(guessPlayer) {
    //guessPlayer should be array containing 1 player object
      console.log("setting guesses")
      setAllGuesses((prevGuess) => [ ...prevGuess, guessPlayer])
  };

  function handleCount () {
    if (count < 8) {
      setCount(count+1);
    } else {
      setCount(0);
    }
  };

  async function submitGuess (guessName) {

    //if already guessed
    if (allGuesses.filter((obj) => {
      return obj.Fullname.toLowerCase() === guessName.toLowerCase();
    }).length > 0) {
      console.log('duplicated guess');
      return;
    }

    console.log('oops proceeded');

    const player = JSON.parse(localStorage.allplayers).data.filter((obj) => {
      return obj.Fullname.toLowerCase() === guessName.toLowerCase();
    })

    //if only one match
    if (player.length === 1) {
      console.log(player[0]);
      setCurrGuess(player[0]);
      addGuess(player[0]);
      setCount(prev => prev + 1);
      await axiosAuthed.put('/add-guesses', { "playerName" : guessName })
    } else {
      console.log('guess didnt match')
      return;
    }

    console.log(count);
    //if correct
    if (guessName.toLowerCase() === correctAnswer.Fullname.toLowerCase()) {
      console.log('nice!!!')
      setIfSuccess('yes');
      await axiosAuthed.put('/guess-correct');
    // if didnt guess correct
    } else if (count === 8) {
      console.log("reached max")
      await axiosAuthed.put('/clear');
      setIfSuccess('no')
    } else {
      console.log(correctAnswer)

    }
  };

  function randomizeCorrectAnswer() {
    var max = playerDatabase.length;
    var index = Math.floor(Math.random() * max);
    setCorrectAnswer(playerDatabase[index]);
  };

  const initialLoad = async () => {
    //if no playerDB in localStorage, run initial load
    if (!localStorage.allplayers) {
      console.log('reload storage')
      try {
          const allplayers = await axios.get('/players');
          localStorage.allplayers = JSON.stringify(allplayers);
      } catch (err) {
        if(!err?.response) {
          setErrMsg('No Server Response');
        } else if (err.response?.status === 500) {
          setErrMsg('Error loading players');
        }
        errRef.current.focus();
      } finally {
        setCorrectAnswer(JSON.parse(localStorage.allplayers).data[0])
      }
    }
    // localStorage.allplayers = '';
    console.log('storePlayersLocally ran');
    console.log('auth', auth );

    //get current userGuesses from DB
    const userData = await axiosAuthed.get('/userRecords');
    const userGuesses = userData.data.userGuesses.map((name) => {
      return name.toLowerCase();
    });
    setCount(userGuesses.length + 1);
    const userGuessesObj = JSON.parse(localStorage.allplayers).data.filter((obj) => { return userGuesses.indexOf(obj.Fullname.toLowerCase()) > -1; })
    setAllGuesses(userGuessesObj);

    //set correct Answer
    const correctAns = userData.data.correctAnswer.toLowerCase();
    const correctAnssObj = JSON.parse(localStorage.allplayers).data.filter((obj) => { return correctAns === obj.Fullname.toLowerCase(); })
    console.log('corretAnswer', correctAnssObj[0]);
    setCorrectAnswer(correctAnssObj[0]);
  }

  async function reset () {
    const userData = await axiosAuthed.get('/reset');
    const correctAns = userData.data.correctAnswer.toLowerCase();
    const correctAnssObj = JSON.parse(localStorage.allplayers).data.filter((obj) => { return correctAns === obj.Fullname.toLowerCase(); })
    setCorrectAnswer(correctAnssObj[0]);
    setAllGuesses([]);
    setCount(1);
    setIfSuccess('unsure');
  };

  useEffect(()=> {
   // searchNBAstats((response) => {
      //     playerDatabase = response;
      //     console.log(playerDatabase);
      //   }); (need to put below in callback too)

    //if all players not stored locally, store players
    initialLoad();


    // var example = exampleNBAdata.slice(0, 7);//need to comment this
    // setAllGuesses(example) //need to uncommnet this only for test
    // setCorrectAnswer(example[0]);
    // // randomizeCorrectAnswer(); need to uncomment for actual
    // setPlayerNames(["Bradley Beal", "John Wall", "Otto Porter Jr.", "Garrett Temple", "Terrence Ross", "Jonas Valanciunas", "Demar Derozan"]);

    // console.log(playerNames);
  },[]);


//need to uncomment this!
  // useEffect(()=>{
  //   console.log(allGuesses);
  //   console.log(count);
  // }, [allGuesses]);

  return (
    <div className="home-container container" >
      <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
      <div className={ifSuccess === "unsure" ? 'search-form-container' : "offscreen" }>
        <Input handleSubmit={submitGuess} playerNames={playerNames} count={count}/>
      </div>
      <button className="hint" onClick={() => setIsHintShowing(true)}>Need a quick hint?</button>
      <p className={ifSuccess === "yes" ? "correct-message" : "offscreen"} aria-live="assertive">
        Guessed Correct!
        <button onClick={reset}>Close</button>
      </p>
      <p className={ifSuccess === "no" ? "correct-message" : "offscreen"} aria-live="assertive">
        Sorry. You didnt get it this time!
        <button onClick={reset}>Try again</button>
      </p>
      <GuessTable players={allGuesses} correctPlayer={correctAnswer}/>
      <div className={isHintShowing ? "hint-overlay" : "hint-overlay-hidden"}>
        <div className="hint-modal">
          <button className="close-btn" onClick={() => setIsHintShowing(false)}>X</button>
          <h3>A little sneak peak</h3>
          <img src={correctAnswer.PhotoURL}></img>
          {/* <div>{correctAnswer.PhotoUrl}</div>  */}
          <div>Do you know who it is now?</div>
        </div>
      </div>
    </div>
  )
}

export default Home;