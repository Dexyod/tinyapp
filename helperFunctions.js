const bcrypt = require("bcrypt");
const urlDatabase = require("./urlDatabase");

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
        views: database[key].views,
        visitorIds: database[key].visitorIds,
        uniqueViews: database[key].uniqueViews,
        timeStamps: database[key].timestamp,
      };
    }
  }

  return filtered;
};

const viewsBot = (id, database) => {
  let timestamp = new Date().toUTCString();
  timestamp = timestamp.split(" ").slice(0, 6).join(" ");
  database["views"]++;
  if (id) {
    if (database["visitorIds"].length === 0) {
      database["visitorIds"].push([id, timestamp]);
      database["uniqueViews"]++;
      return;
    }
    for (let i = 0; i < database["visitorIds"].length; i++) {
      if (!database["visitorIds"][i] === id) {
        database["visitorIds"].push([id, timestamp]);
        database["uniqueViews"]++;
        return;
      }
    }
  }
  return;
};
module.exports = {
  isEmptyString,
  isEmailInUse,
  authLogin,
  randomUID,
  urlsForUser,
  viewsBot,
};
