const playersModel = require('../models/players.js');

module.exports ={
  handleLoadAllPlayers : async (req, res) => {
    try {
      const players = Object.values(await playersModel.getAllPlayers());
      console.log(Array.isArray(players));

      res.status(200).json(players);
    } catch (err) {
      res.status(500).json({'message' : err.message});
    }
  }
}