const { NOT_FOUND } = require('http-status');
const User = require('../models/User');

const setCurrentUser = async function setCurrentUser(req, res, next) {
  const user = await User.findById(res.locals.userId);

  if (!user) {
    return res.status(NOT_FOUND).json({
      message: `Could not find user with ID ${res.locals.userId}`,
    });
  }

  res.locals.currentUser = user;
  return next();
};

module.exports = setCurrentUser;
