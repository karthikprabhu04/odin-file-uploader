const { Router } = require("express");
const router = Router();
const userController = require("../controllers/userController");
const { ensureAuthenticated } = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

// Public routes
router.get("/", userController.getHomePage);
router.get("/login", userController.getLoginPage);
router.post("/login", userController.postLogin);
router.get("/register", userController.getRegisterPage);
router.post("/register", userController.postRegister);
router.get("/logout", userController.logout);

// Protected route
router.get("/dashboard", ensureAuthenticated, userController.getDashboard);

// Configure Multer and storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  }
});

const upload = multer({ storage });


router.get("/upload", ensureAuthenticated, (req, res) => {
  res.render("upload");
});

router.post(
  "/upload",
  ensureAuthenticated,
  upload.single("file"),
  (req, res) => {
    console.log("File uploaded:", req.file);
    res.send("File uploaded successfully!");
  }
);

module.exports = router;
