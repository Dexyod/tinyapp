const { assert } = require("chai");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const {
  isEmptyString,
  isEmailInUse,
  authLogin,
  urlsForUser,
} = require("../helperFunctions");

const testUsers = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", salt),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", salt),
  },
};
const testUrlDb = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  "9sm5xK": { longURL: "http://www.google.com", userID: "test" },
  b2xVn2: { longURL: "http://www.lighthouselabs.ca", userID: "userRandomID" },
};

describe("#isEmailInUse", function () {
  it("should return true if a user enters an email that already exists", function () {
    const user = isEmailInUse("user@example.com", testUsers);
    assert.isTrue(user);
  });
  it("should return false if a user enters an email that doesn't exists", function () {
    const user = isEmailInUse("test@example.com", testUsers);
    assert.isFalse(user);
  });
});

describe("#isEmptyString", () => {
  it("should return true if user enters an empty string for email", () => {
    const input = isEmptyString("", "password");
    assert.isTrue(input);
  });
  it("should return true if user enters an empty string for password", () => {
    const input = isEmptyString("email@email.com", "");
    assert.isTrue(input);
  });
  it("should return false if user enters a valid string for email and password", () => {
    const input = isEmptyString("email@email.com", "password");
    assert.isFalse(input);
  });
  it("should return true if user enters an array for email", () => {
    const input = isEmptyString([], "password");
    assert.isTrue(input);
  });
});

describe("#authLogin", () => {
  it("should return true if email and password are the same as email and password in DB", () => {
    const input = authLogin(
      "user@example.com",
      "purple-monkey-dinosaur",
      testUsers
    );

    assert.isTrue(input);
  });
  it("should return false if email and password are different from the email and password in DB", () => {
    const input = authLogin("user@example.com", "dinosaur", testUsers);

    assert.isFalse(input);
  });
});
describe("#urlsForUser", () => {
  it("should return an object as the result", () => {
    const input = urlsForUser("id", testUrlDb);
    const expectedOutput = {};
    assert.deepEqual(input, expectedOutput);
  });
  it("should return an object of urls specific to the id passed", () => {
    const input = urlsForUser("test", testUrlDb);
    const expectedOutput = {
      "9sm5xK": { longURL: "http://www.google.com", userID: "test" },
    };
    assert.deepEqual(input, expectedOutput);
  });
});
