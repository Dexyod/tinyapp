// Set up requirements for server
const express = require("express");
const app = express();
const PORT = 8080;

// Set up EJS
app.set("view engine", "ejs");

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

// Home Route
app.get("/", (req, res) => {
  res.send("Hello!");
});

// Urls Route
app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase }
  res.render("urls_index", templateVars);
})

// Urls Route for JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// Hello Route
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
