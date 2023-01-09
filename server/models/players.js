const { Players } = require('../database/index.js');

module.exports = {
  getAllPlayers : async () => {
    return await Players.find({})
  },

  generateRandomCorrectAnswer : async () => {
    let result = {};
    const randomIndex = Math.floor(Math.random() * 500);

    await Players.find({})
      .then((players) => {
        result = players[randomIndex];
      })

    return result.Fullname;
  }
}