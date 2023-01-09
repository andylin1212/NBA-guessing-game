const { Users } = require('../database/index.js');


module.exports = {
  addNewUser : ({username, password}) => {
     const user = new Users({username, password, successCount : 0});

     return user.save();
  },

  findDuplicate : (obj) => {
    console.log(obj);
    return Users.findOne(obj)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        return true;
      })
  },

  findUser : (obj) => {
    return Users.findOne(obj)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.error(err);
        return false;
      })
  },

  setRefreshToken : (foundUser, refreshToken) => {
    foundUser.refreshToken = refreshToken;
    return foundUser.save();
  }
}