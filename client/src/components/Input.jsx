import React, { useState } from 'react';

const Input = ({handleSubmit, playerNames, count}) => {
  const [entry, setEntry] = useState("");
  const [display, setDisplay] = useState(true);

  return (
    <form className="search-form" onSubmit={(evt) => {
      evt.preventDefault();
      handleSubmit(entry);
      setEntry("");
    }}>
      <input className="search-input" type="text" placeholder={"Guess " + count + " of 8..."} value={entry} onChange={(evt) => {
        evt.preventDefault();
        setEntry(evt.target.value);
      }}/>
      <button className="search-button">Go!</button>
      {/* {display && (
        <div className="auto-container">
          {playerNames
            // .filter((name) => {name.indexOf(entry) === 0 })
            .map((name) => {
              return <div>
                <span>{name}</span>
             </div>
           })}
        </div>
       )} */}
    </form>
  )
};

export default Input;