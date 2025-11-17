const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ✅ Create a new folder
exports.createFolder = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  try {
    const folder = await prisma.folder.create({
      data: {
        name,
        userId,
      },
    });
    res.redirect("/folders"); // or send JSON if using API routes
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating folder");
  }
};

// ✅ Get all folders for the current user
exports.getFolders = async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      include: { files: true },
    });
    res.render("folders", { folders, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching folders");
  }
};

// ✅ Rename a folder
exports.renameFolder = async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  try {
    await prisma.folder.update({
      where: { id: parseInt(id) },
      data: { name: newName },
    });
    res.redirect("/folders");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error renaming folder");
  }
};

// ✅ Delete a folder (and its files)
exports.deleteFolder = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.file.deleteMany({ where: { folderId: parseInt(id) } });
    await prisma.folder.delete({ where: { id: parseInt(id) } });
    res.redirect("/folders");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting folder");
  }
};
