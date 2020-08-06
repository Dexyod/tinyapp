const bcrypt = require("bcrypt");

const isEmptyString = (email, password) => {
  if (email === "" || password === "") {
    return true;
  }

  if (typeof email !== "string" || typeof password !== "string") {
    return true;
  }

  return false;
};

const isEmailInUse = (email, database) => {
  for (const key in database) {
    if (database[key].email === email) {
      return true;
    }
  }
  return false;
};

const authLogin = (email, password, database) => {
  for (const key in database) {
    if (
      database[key].email === email &&
      bcrypt.compareSync(password, database[key].password)
    ) {
      return true;
    }
  }
  return false;
};

const randomUID = () => {
  const randomString = Math.random().toString(36).substring(2, 8);

  return randomString;
};

const urlsForUser = (id, database) => {
  let filtered = {};
  for (const key in database) {
    if (database[key].userID === id) {
      filtered[key] = {
        longURL: database[key].longURL,
        userID: id,
      };
    }
  }

  return filtered;
};
module.exports = {
  isEmptyString,
  isEmailInUse,
  authLogin,
  randomUID,
  urlsForUser,
};
