const { Router } = require("express");
const router = Router();
const { ensureAuthenticated } = require("../middleware/auth");
const fileController = require("../controllers/fileController");

router.get("/folder/:folderId", ensureAuthenticated, fileController.getFolderFiles);
router.post(
  "/upload/:folderId",
  ensureAuthenticated,
  (req, res, next) => req.app.locals.upload.single("file")(req, res, next),
  fileController.uploadFile
);

module.exports = router;
