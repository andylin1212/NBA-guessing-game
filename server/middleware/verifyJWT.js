const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.sendStatus(401); //Unauthroized
  console.log('im being used', header);
  const token = header.split(' ')[1];
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, token) => {
      if (err) return res.sendStatus(403); //invalid token
      req.user = token.username;
      next();
    }
  )
}

module.exports = verifyJWT;