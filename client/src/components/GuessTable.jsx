import React from 'react';
import GuessTableRow from '../components/GuessTableRow.jsx';

var GuessTable = ({players, correctPlayer}) => {

  return (
    <table className="guess-table">
    <thead>
      <tr>
        <th>Player Name</th>
        <th>Team</th>
        <th>Conf.</th>
        <th>Div.</th>
        <th>Pos.</th>
        <th>Height</th>
        <th>Weight</th>
        <th>Age</th>
      </tr>
    </thead>
    <tbody>
      {players.map((player) => <GuessTableRow key={player._id} player={player} correctPlayer={correctPlayer}/>)}
    </tbody>
    </table>
  )
};

export default GuessTable;