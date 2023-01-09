const axios = require('axios');
const exampleNBAData = require('./exampleNBAdata.js');



const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nbadb', {useNewUrlParser: true, useUnifiedTopology: true} );

mongoose.set('strictQuery', false);

let usersSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String,
  successCount: {
    type: Number,
    default : 0
  },
  currGuesses : [String],
  correctAnswer : {
    type: String,
    default: 'Bradley Beal'
  }
})

//add update userCount method

usersSchema.methods.addSuccessCount = function () {
  this.successCount++;
  this.save();
};

usersSchema.methods.addGuesses = function (playerName) {
  if (this.currGuesses.length >= 7) {
    this.currGuesses = [];
  } else {
    this.currGuesses.push(playerName);
  }
  this.save();
};

let Users = mongoose.model('Users', usersSchema);

//Players
let playersSchema = mongoose.Schema({
  Fullname : String,
  Team: String,
  Conference: String,
  Division: String,
  Position: String,
  PositionCategory: String,
  Height: String,
  Weight: Number,
  Age: Number,
  PhotoURL: String
})

let Players = mongoose.model('Players', playersSchema);

//data manipulation
const easternConfTeams = ['BOS', 'TOR', 'PHI', 'NY', 'BKN', 'MIL', 'CLE', 'IND', 'CHI', 'DET', 'ATL', 'WAS', 'MIA', 'ORL', 'CHA'];
const westernConfTeams = ['PHO', 'LAC', 'SAC', 'GS', 'LAL', 'MEM', 'DAL', 'NO', 'SA', 'HOU', 'POR', 'DEN', 'UTA', 'MIN', 'OKC'];

function determineConference (team) {
  return easternConfTeams.indexOf(team) > -1 ? 'East' : 'West';
};


function determineDivision(team) {
  var eastDiv = easternConfTeams.indexOf(team);
  var westDiv = westernConfTeams.indexOf(team);
    if (eastDiv > -1) {
      if (eastDiv < 5) {
        return 'Atl.';
      } else if (eastDiv < 10) {
        return 'Cen.';
      } else {
        return 'SE';
      }
    } else {
      if (westDiv < 5) {
        return 'Pac.';
      } else if (westDiv < 10) {
        return 'SW';
      } else {
        return 'NW';
      }
    }
};

function heightConverter (height) {
  let feet = Math.floor(height/12);
  let inches = height % 12;
  return feet + "'" + inches + "\"";
};


function ageCalculator (age) {
  let playerBirthFrom1970 = Date.parse(age); //milliseconds
  let nowFrom1970 = Date.now();
  let ageInYears = Math.floor((nowFrom1970 - playerBirthFrom1970) / (365*24*60*60*1000));
  return ageInYears;
}


//load player function
async function loadPlayers (exampleNBAData) {
  await Players.deleteMany({});


  for (let player of exampleNBAData) {

    const newPlayer = new Players({
      Fullname : player.FirstName + " " +player.LastName,
      Team : player.Team,
      Conference: determineConference(player.Team),
      Division: determineDivision(player.Team),
      Position : player.Position,
      PositionCategory : player.PositionCategory,
      Height : heightConverter(player.Height),
      Weight : player.Weight,
      Age : ageCalculator(player.BirthDate),
      PhotoURL : player.PhotoUrl
    })

    await newPlayer.save();
  }

  const count = await Players.count({});
  console.log(count);
}


// store all players in DB
// loadPlayers(exampleNBAData);

// const playerNames = getAllPlayerNames();
// console.log(playerNames[0]);

//get
// axios.get('https://api.sportsdata.io/v3/nba/scores/json/Players?key=3468f3501c6443b4b7af462b1649d1ec',
// {
//   headers: {
//     'Content-Type' : 'application/json',
//     "Ocp-Apim-Subscription-Key": "3468f3501c6443b4b7af462b1649d1ec"
//   },
// })
//   .then((result) => {
//     console.log(result.data[0])
//     // for (let player of result.json()) {
//     //   console.log(player.FirstName);
//     // }
//   })


module.exports.Users = Users;
module.exports.Players = Players;