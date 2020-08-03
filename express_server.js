// Set up requirements for server
const express = require("express");
const app = express();
const PORT = 8080;

// Set up EJS
app.set("view engine", "ejs");

// Set up body-parser;
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Import randomStringGenerator function
const randomString = require("./randomString");

// placeholder database for urls for now
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Home Route
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Urls Route
app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

// Urls Route for JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// GET Urls/new Route
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

// POST Urls/new Route to create new url
app.post("/urls", (req, res) => {
  console.log(req.body);
  // res.send("Ok");

  //redirect back to urls
  res.redirect("/urls");
});

// Urls Show Route
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: req.params.longURL,
  };
  res.render("urls_show", templateVars);
});

// Hello Route
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
