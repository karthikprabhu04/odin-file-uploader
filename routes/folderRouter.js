const { Router } = require("express");
const router = Router();
const { ensureAuthenticated } = require("../middleware/auth");
const folderController = require("../controllers/folderController");

router.get("/", ensureAuthenticated, folderController.getFolders);
router.post("/create", ensureAuthenticated, folderController.createFolder);
router.post("/:id/rename", ensureAuthenticated, folderController.renameFolder);
router.post("/:id/delete", ensureAuthenticated, folderController.deleteFolder);

module.exports = router;
