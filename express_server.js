// Set up requirements for server
const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 8080;
// Set up cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());
// Set up EJS
app.set("view engine", "ejs");
// Set up body-parser;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
// Set up morgan
app.use(morgan("dev"));

// Import randomStringGenerator and users DB
const randomString = require("./randomString");
const users = require("./usersDb");
const generateRandomString = require("./randomString");

// placeholder database for urls for now
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Hello Route
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// Home Route
app.get("/", (req, res) => {
  res.send("Hello!!");
});

// Urls Route
app.get("/urls", (req, res) => {
  let templateVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    user: users,
  };

  res.render("urls_index", templateVars);
});

// Urls Route for JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET urls_new Route
app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: req.cookies["user_id"],
    user: { users },
  };

  res.render("urls_new", templateVars);
});

// POST to CREATE new url
app.post("/urls", (req, res) => {
  let shortURL = randomString();

  urlDatabase[shortURL] = `http://${req.body.longURL}`;

  console.log(`New URL ${shortURL} Created`);
  //redirect back to urls
  res.redirect(`/urls/${shortURL}`);
});

// Delete Route
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];

  console.log(`${req.params.shortURL} Deleted`);
  res.redirect("/urls");
});

// Update Route
app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = `http://${req.body.longURL}`;

  res.redirect("/urls");
});

// urls_show Route
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: req.cookies["user_id"],
    user: { users },
  };

  res.render("urls_show", templateVars);
});

// ShortURL requests handler
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];

  res.redirect(longURL);
});

// Register GET Route
app.get("/register", (req, res) => {
  let templateVars = {
    username: req.cookies["user_id"],
    user: { users },
  };
  res.render("register", templateVars);
});

// Register POST Route
app.post("/register", (req, res) => {
  let userID = generateRandomString();

  users[userID] = {
    id: userID,
    email: req.body.email,
    password: req.body.password,
  };
  res.cookie("user_id", userID);
  console.log(users);
  res.redirect("/urls");
});

// Login POST Route
app.post("/login", (req, res) => {
  res.cookie("user_id", req.body.username);

  res.redirect("/urls");
});

// Log Out POST Route
app.post("/logout", (req, res) => {
  res.clearCookie("user_id", req.body.username);

  res.redirect("/urls");
});

// Start listener on PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
