db = require("../db/queries")

exports.getHomePage = (req, res) => {
  res.render("index")
}