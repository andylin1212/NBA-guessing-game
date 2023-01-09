const path = require('path');
const bcrypt = require('bcrypt');
const userModel = require('../models/users.js');
const playerModel = require('../models/players.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  handleNewUser : async(req, res) => {
    const {username, pwd} = req.body;
    //check if username and password inputted
    console.log(req.body);
    if (!username || !pwd) res.status(400).json({'message': 'Username and password are required.'});
    //check if duplicate
    try {
      //check if username exists
      const findDuplicate = await userModel.findDuplicate({username});
      console.log(findDuplicate);
      if (findDuplicate) return res.sendStatus(409); //there is conflict

      const hashedPwd = await bcrypt.hash(pwd, 10);
      //store new user
      const newUser = {"username": username, "password": hashedPwd}
      //use model to add newUser
      await userModel.addNewUser(newUser);
      res.status(201).json({'success': `New user ${username} created!`})
    } catch (err) {
      res.status(500).json({'message' : err.message});
    }
  },

  handleLogin : async (req, res) => {
    const {username, pwd} = req.body;
    console.log(username, pwd)
    //check if username and password inputted
    if (!username || !pwd) res.status(400).json({'message': 'Username and password are required.'});

    //check if user exists
    const foundUser = await userModel.findUser({username});
    if (!foundUser) return res.sendStatus(401); //Unauthorized

    //if user does exist, evaluate password
    const matchPwd = await bcrypt.compare(pwd, foundUser.password);

    if (matchPwd) {
      //create JWT
      const accessToken = jwt.sign(
        { "username" : foundUser.username},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m'}
      );
      const refreshToken = jwt.sign(
        { "username" : foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
      );

      //add refreshtoken to users DB
      await userModel.setRefreshToken(foundUser, refreshToken);

      //return refresh token in httpOnly cookie
      res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000} )

      //return accesstoken in body
      res.json({ accessToken})
    } else {
      res.sendStatus(401);
    }
  },

  handleRefreshToken : async (req, res) => {
    //get cookie after cookie parser middleware
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); //Unauthorized if no jwt cookie

    const refreshToken = cookies.jwt;

    const findUser = await userModel.findUser({refreshToken});
    if (!findUser) return res.sendStatus(403); //this access is not allowed

    //verify the token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, token) => {
        if (err || findUser.username !== token.username) return res.sendStatus(403); //invalid token
        const accessToken = jwt.sign(
          { "username" : token.username},
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '15m'}
        );
        res.json({ accessToken })
      }
    )
  },

  handleLogout : async (req, res) => {
    const cookies = req.cookies;
    //if no jwt cookie, customer not logged in
    if (!cookies?.jwt) return res.sendStatus(204); //no content

    const refreshToken = cookies.jwt;

    const findDuplicate = await userModel.findDuplicate({refreshToken});

    //if no duplicate using refreshToken, clear cookie in response
    if (!findDuplicate) {
      res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
      return res.sendStatus(204);
    }

    //client side code needs to delete cookie as well

    //delete refresh token from user in userDB
    await userModel.setRefreshToken(findDuplicate, '');
    //clear cookie in response
    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
    return res.sendStatus(204);
  },

  handleGuessCorrect : async (req, res) => {
    const cookies = req.cookies;
    //if no jwt cookie, customer not logged in
    if (!cookies?.jwt) return res.sendStatus(204); //no content

    const refreshToken = cookies.jwt;

    const user = await userModel.findUser({refreshToken});
    if (!user) return res.sendStatus(401); //Unauthorized


    try {
      await user.addSuccessCount();
      user.currGuesses = [];
      const correctAnswer = await playerModel.generateRandomCorrectAnswer();
      user.correctAnswer = correctAnswer;
      user.save();
    } catch (err) {
      res.status(500).json({'message' : err.message});
    } finally {
      return res.sendStatus(204);
    }
  },

  handleAddGuesses: async (req, res) => {
    const cookies = req.cookies;
    //if no jwt cookie, customer not logged in
    if (!cookies?.jwt) return res.sendStatus(204); //no content

    const refreshToken = cookies.jwt;
    const playerName = req.body.playerName;

    const user = await userModel.findUser({refreshToken});
    if (!user) return res.sendStatus(401); //Unauthorized

    try {
      await user.addGuesses(playerName);
    } catch (err) {
      res.status(500).json({'message' : err.message});
    } finally {
      return res.sendStatus(204);
    }
  },

  getUserRecords: async (req, res) => {
    const cookies = req.cookies;
    //if no jwt cookie, customer not logged in
    if (!cookies?.jwt) return res.sendStatus(204); //no content

    const refreshToken = cookies.jwt;

    const user = await userModel.findUser({ refreshToken });
    if (!user) return res.sendStatus(401); //Unauthorized

    return res.status(200).json({ 'userGuesses' : user.currGuesses, 'correctAnswer' : user.correctAnswer});
  },

  handleClear : async (req, res) => {
    const cookies = req.cookies;
    //if no jwt cookie, customer not logged in
    if (!cookies?.jwt) return res.sendStatus(204); //no content

    const refreshToken = cookies.jwt;

    const user = await userModel.findUser({ refreshToken });
    if (!user) return res.sendStatus(401); //Unauthorized

    user.currGuesses = [];
    const correctAnswer = await playerModel.generateRandomCorrectAnswer();
    user.correctAnswer = correctAnswer;
    user.save();

    return res.sendStatus(204);
  },

  handleReset : async (req, res) => {
    const cookies = req.cookies;
    //if no jwt cookie, customer not logged in
    if (!cookies?.jwt) return res.sendStatus(204); //no content

    const refreshToken = cookies.jwt;
    const user = await userModel.findUser({ refreshToken });
    if (!user) return res.sendStatus(401); //Unauthorized

    return res.status(200).json({ 'correctAnswer' : user.correctAnswer });
  }
}