const express = require('express');
const config = require('../config.js');
const path = require('path');
const cors = require('cors');
const userControllers = require('./controller/users.js');
const playerControllers = require('./controller/players.js');
const verifyJWT = require('./middleware/verifyJWT.js');
const cookieParser = require('cookie-parser');

const PORT = config.PORT || 3333;
const app = express();

app.use(express.static(path.join(__dirname + '/../client/dist')));
app.use(cors());
app.use(express.urlencoded({ extended: false}))
app.use(express.json());
app.use(cookieParser());


app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});

// app.get('/login', (req, res) => {res.end()});

app.post('/login', userControllers.handleLogin);
app.post('/signup', userControllers.handleNewUser);
app.get('/refresh', userControllers.handleRefreshToken);
app.get('/players', playerControllers.handleLoadAllPlayers);



app.use(verifyJWT);
app.put('/guess-correct', userControllers.handleGuessCorrect);
app.put('/add-guesses', userControllers.handleAddGuesses)
app.get('/userRecords', userControllers.getUserRecords)
app.put('/clear', userControllers.handleClear);
app.get('/reset', userControllers.handleReset)
app.get('/logout', userControllers.handleLogout);

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'), function(err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})