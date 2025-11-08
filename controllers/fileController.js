const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 📁 Upload file into a folder
exports.uploadFile = async (req, res) => {
  try {
    const folderId = parseInt(req.params.folderId);
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: req.file.path,
        userId,
        folderId,
      },
    });

    console.log("Uploaded:", file);
    res.redirect(`/files/folder/${folderId}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error uploading file");
  }
};

// 📂 View files in a folder
exports.getFolderFiles = async (req, res) => {
  const folderId = parseInt(req.params.folderId);
  const userId = req.user.id;

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    if (!folder || folder.userId !== userId) {
      return res.status(403).send("Not allowed");
    }

    res.render("folder_files", { folder, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading folder");
  }
};
