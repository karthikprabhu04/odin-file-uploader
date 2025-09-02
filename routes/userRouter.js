const { Router } = require("express")
const router = Router();
const userController = require("../controllers/userController")

router.get("/", userController.getHomePage)





module.exports = router;