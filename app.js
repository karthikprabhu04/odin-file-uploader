const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const userRouter = require("./routes/userRouter");
require("dotenv").config();

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "secret",
    resave: "false",
    saveUninitalized: "false",
  })
);
app.use(passport.session());

app.get("/", userRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) {
    throw Error;
  }
  console.log(`App listening on port ${PORT}`);
});
