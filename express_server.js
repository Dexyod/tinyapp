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
} = require("./helperFunctions");
const users = require("./usersDb");
const urlDatabase = require("./urlDatabase");

app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["password", "EnCoDedPaSWOrdS"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(methodOverride("_method"));

// Home Route
app.get("/", (req, res) => {
  res.redirect("/urls");
});

// Urls Route
app.get("/urls", (req, res) => {
  let userID = req.session.user_id;

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

// GET Route for urls JSON DB
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET route for users JSON DB
app.get("/users.json", (req, res) => {
  res.json(users);
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
  if (!req.body.longURL.includes("http://", 0)) {
    urlDatabase[shortURL] = {
      longURL: `http://${req.body.longURL}`,
      userID: userID,
      clickCount: 0,
    };
    res.redirect(`/urls`);
  } else {
    urlDatabase[shortURL] = {
      longURL: req.body.longURL,
      userID: userID,
      clickCount: 0,
    };
    res.redirect(`/urls`);
  }
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
  // console.log(shortURL.userID);
  if (userID === shortURL.userID) {
    if (!req.body.longURL.includes("http://", 0)) {
      shortURL.longURL = `http://${req.body.longURL}`;
      res.redirect("/urls");
    } else {
      shortURL.longURL = req.body.longURL;
      res.redirect("/urls");
    }
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
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.session.user_id],
    clickCount: users[req.session.clickCount],
    error: "",
  };

  res.render("urls_show", templateVars);
});

// ShortURL requests handler
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;

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
  const password = bcrypt.hashSync(req.body.password, salt);

  if (
    isEmailInUse(email, users) === false &&
    isEmptyString(email, password) === false
  ) {
    users[userID] = {
      id: userID,
      email: email,
      password: password,
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

  // console.log(users);
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
    let user_id = "";
    for (const key in users) {
      if (users[key].email === email) {
        user_id += users[key].id;
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
