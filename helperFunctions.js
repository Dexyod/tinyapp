const users = require("./usersDb");

const isEmptyString = (email, password) => {
  if (email === "" || password === "") {
    return true;
  } else {
    return false;
  }
};

const isEmailInUse = (email) => {
  for (const key in users) {
    if (users[key].email === email) {
      return true;
    }
  }
  return false;
};

const authLogin = (email, password) => {
  for (const key in users) {
    if (users[key].email === email && users[key].password === password) {
      return true;
    }
  }
  return false;
};

const randomUID = () => {
  const randomString = Math.random().toString(36).substring(2, 8);

  return randomString;
};

module.exports = {
  isEmptyString,
  isEmailInUse,
  authLogin,
  randomUID,
};
