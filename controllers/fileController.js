const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");
const path = require("path");
const supabase = require("../config/supabase");

// 📁 Upload file into a folder
exports.uploadFile = async (req, res) => {
  try {
    const folderId = parseInt(req.params.folderId);
    const userId = req.user.id;

    if (!req.file) return res.status(400).send("No file uploaded");

    const supabasePath = `${userId}/${folderId}/${Date.now()}-${req.file.originalname}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("user-files")
      .upload(supabasePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).send("Error uploading to cloud storage");
    }

    // Public URL
    const { publicUrl } = supabase.storage
      .from("user-files")
      .getPublicUrl(supabasePath).data;

    // Save file metadata to Prisma
    await prisma.file.create({
      data: {
        name: req.file.originalname,
        url: publicUrl,
        size: req.file.size,
        userId,
        folderId,
      },
    });

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

exports.getFileDetails = async (req, res) => {
  const fileId = parseInt(req.params.fileId);
  const userId = req.user.id;

  try {
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== userId) {
      return res.status(403).send("Not allowed");
    }

    res.render("file_details", {
      file,
      user: req.user
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading file details");
  }
};

exports.downloadFile = async (req, res) => {
  const fileId = parseInt(req.params.fileId);
  const userId = req.user.id;

  try {
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.userId !== userId)
      return res.status(403).send("Not allowed");

    res.redirect(file.url); // directly downloads from Supabase
  } catch (err) {
    console.error(err);
    res.status(500).send("Error downloading file");
  }
};
