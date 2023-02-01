import React from 'react';

const GuessTableRow = ({player, correctPlayer}) => {
  //variable declarations

  //style determination
  var correctStyle = {backgroundColor : "#06D6A0", color : 'black'};
  var wrongStyle = {backgroundColor : "#EF476F", color : 'white'};
  var closeStyle = {backgroundColor : "#FFD166", color : 'black'};

  var ifCorrectPlayer = player === correctPlayer;
  var ifCorrectTeam = player.Team == correctPlayer.Team;
  var ifCorrectConf = player.Conference == correctPlayer.Conference;


  function determineDivStyle(player, correctPlayer) {
    if (player.Division === correctPlayer.Division) {
      return correctStyle;
    } else if (ifCorrectConf) {
      return closeStyle;
    } else {
      return wrongStyle;
    }
  };

  function determinePositionStyle (player, correctPlayer) {
    if (player.Position === correctPlayer.Position) {
      return correctStyle;
    } else if (player.PositionCategory === correctPlayer.PositionCategory) {
      return closeStyle;
    } else {
      return wrongStyle;
    }
  };

  function determineBodyStyle (player, correctPlayer, attribute, diffValue) {
    if (player[attribute] === correctPlayer[attribute]) {
      return correctStyle;
    } else if (Math.abs(player[attribute] - correctPlayer[attribute]) <= diffValue) {
      return closeStyle;
    } else {
      return wrongStyle;
    }
  };

  const nameStyle = {
    backgroundColor : ifCorrectPlayer ? correctStyle.backgroundColor : 'white',
    color : 'black',
    fontWeight: 'bold',
    width: "9em"
  };

  const teamStyle = ifCorrectTeam ? correctStyle : wrongStyle;
  const confStyle = ifCorrectConf ? correctStyle : wrongStyle;
  const divStyle = determineDivStyle(player, correctPlayer);
  const posStyle = determinePositionStyle(player, correctPlayer);
  const heightStyle = determineBodyStyle(player, correctPlayer, 'Height', 2);
  const weightStyle = determineBodyStyle(player, correctPlayer, 'Weight', 5);
  const ageStyle = determineBodyStyle(player, correctPlayer, 'Age', 2);

  return (
    <tr>
      <td className="guess-name" style={nameStyle}>{player.Fullname}</td>
      <td className="guess team" style={teamStyle}>{player.Team}</td>
      <td className="guess conference" style={confStyle}>{player.Conference}</td>
      <td className="guess division" style={divStyle}>{player.Division}</td>
      <td className="guess position" style={posStyle}>{player.Position}</td>
      <td className="guess height" style={heightStyle}>{player.Height}</td>
      <td className="guess weight" style={weightStyle}>{player.Weight} lbs</td>
      <td className="guess age" style={ageStyle}>{player.Age}</td>
    </tr>
  )
};

export default GuessTableRow;


