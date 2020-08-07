// Set up requirements for server
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const methodOverride = require("method-override");

// cookies and encryption
const cookieSession = require("cookie-session");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// constant variables and helper functions
const PORT = 8080;
const {
  randomUID,
  isEmptyString,
  isEmailInUse,
  authLogin,
  urlsForUser,
  viewsBot,
} = require("./public/helper/helperFunctions");

// Import fake DBs
const users = require("./database/usersDb");
const urlDatabase = require("./database/urlDatabase");

// Set up server config
app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["password", "EnCoDedPaSWOrdS"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(methodOverride("_method"));

// GET Home Route
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// Added some helper routes so I can see the DBs easily
// GET Route for urls JSON DB
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET route for users JSON DB
app.get("/users.json", (req, res) => {
  res.json(users);
});

//  GET urls_index Route
app.get("/urls", (req, res) => {
  const userID = req.session.user_id;

  if (userID) {
    let templateVars = {
      urls: urlsForUser(userID, urlDatabase),
      user: users[req.session.user_id],
      error: "",
    };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

// GET urls_new Route
app.get("/urls/new", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
  };
  if (req.session.user_id === null) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
});

// POST to CREATE new url
app.post("/urls", (req, res) => {
  let shortURL = randomUID();
  const userID = req.session.user_id;

  urlDatabase[shortURL] = {
    longURL: req.body.longURL.includes("http://", 0)
      ? req.body.longURL
      : `http://${req.body.longURL}`,
    userID: userID,
    views: 0,
    uniqueViews: 0,
    visitorIds: [],
  };
  res.redirect(`/urls`);
});

// Delete Route
app.delete("/urls/:shortURL/", (req, res) => {
  const userID = req.session.user_id;

  if (userID === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];

    res.redirect("/urls");
  } else {
    let templateVars = {
      error: "Permission Denied",
      user: userID,
    };
    res.status(403);
    res.render("urls_index", templateVars);
  }
});

// Update Route
app.put("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const shortURL = urlDatabase[req.params.shortURL];

  if (userID === shortURL.userID) {
    shortURL.longURL = req.body.longURL.includes("http://", 0)
      ? req.body.longURL
      : `http://${req.body.longURL}`;
    res.redirect("/urls");
  } else {
    let templateVars = {
      error: "Permission Denied",
      user: userID,
    };
    res.status(403);
    res.render("urls_show", templateVars);
  }
});

// GET urls_show Route
app.get("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.session.user_id],
    error: "",
  };
  if (userID === templateVars.longURL.userID) {
    res.render("urls_show", templateVars);
  } else {
    res.status(403);
    res.redirect("/urls");
  }
});

// ShortURL requests handler
app.get("/u/:shortURL", (req, res) => {
  const data = urlDatabase[req.params.shortURL];
  const longURL = data.longURL;
  const userID = req.session.user_id;

  viewsBot(userID, data);

  res.redirect(longURL);
});

// Register GET Route
app.get("/register", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    error: "",
  };
  res.render("register", templateVars);
});

// Register POST Route
app.post("/register", (req, res) => {
  const userID = randomUID();
  const email = req.body.email;
  const password = req.body.password;

  if (
    isEmailInUse(email, users) === false &&
    isEmptyString(email, password) === false
  ) {
    users[userID] = {
      id: userID,
      email: email,
      password: bcrypt.hashSync(password, salt),
    };

    req.session.user_id = userID;
    res.redirect("/urls");
  } else {
    let templateVars = {
      error: "Invalid Username/Password",
      user: users[req.session.user_id],
    };
    res.status(400);
    res.render("register", templateVars);
  }
});

// Login GET Route
app.get("/login", (req, res) => {
  let templateVars = {
    user: users[req.session.user_id],
    error: "",
  };
  res.render("login", templateVars);
});

// Login POST Route
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (authLogin(email, password, users)) {
    for (const key in users) {
      if (users[key].email === email) {
        user_id = users[key].id;
      }
    }

    req.session.user_id = user_id;
    res.redirect("/urls");
  } else {
    const templateVars = {
      error: "Invalid Login Information",
      user: users[req.session.user_id],
    };
    res.status(403);
    res.render("login", templateVars);
  }
});

// Log Out POST Route
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// Start listener on PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
