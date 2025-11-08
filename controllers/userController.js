const passport = require("passport");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getHomePage = (req, res) => {
  res.render("index", { user: req.user || null });
};

exports.getLoginPage = (req, res) => {
  res.render("login", { message: req.flash("error") });
};

exports.postLogin = passport.authenticate("local", {
  successRedirect: "/dashboard",
  failureRedirect: "/login",
  failureFlash: true,
});

exports.getRegisterPage = (req, res) => {
  res.render("register");
};

exports.postRegister = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  res.redirect("/login");
};

exports.getDashboard = (req, res) => {
  res.render("dashboard", { user: req.user });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
};
