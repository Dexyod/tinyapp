const users = require("./usersDb");

const authenticateUser = (submittedEmail, submittedPassword) => {
  if (submittedEmail === "" || submittedPassword === "") {
    console.log("Cannot enter empty string as value");
    return false;
  }
  for (const key in users) {
    if (users[key].email === submittedEmail) {
      console.log(`${submittedEmail} already in use`);
      return false;
    }
  }
  return true;
};

module.exports = authenticateUser;
