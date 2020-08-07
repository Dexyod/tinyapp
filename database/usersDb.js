const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("1234", salt),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("1234", salt),
  },
  aJ48lW: {
    id: "aJ48lW",
    email: "test@test.com",
    password: bcrypt.hashSync("test", salt),
  },
};

module.exports = users;
