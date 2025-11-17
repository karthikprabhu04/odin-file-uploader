const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const userRouter = require("./routes/userRouter");
const initializePassport = require("./config/passport");
require("dotenv").config();
const folderRouter = require("./routes/folderRouter");

const app = express();
const prisma = new PrismaClient();

// MULTER Setup
const multer = require("multer");
const fs = require("fs");

// 🔧 Set up Multer storage to use folder-specific directories
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const folderId = req.params.folderId || "general";
//     const uploadPath = path.join(__dirname, "uploads", folderId);

//     // create folder if it doesn't exist
//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });
const storage = multer.memoryStorage();  // IMPORTANT

const upload = multer({ storage });
app.locals.upload = upload; // make available in routers





// View engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // prune expired sessions every 2 mins
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Initialize passport strategy
initializePassport(passport);


// Routes
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", userRouter);
app.use("/folders", folderRouter);

// Files
const fileRouter = require("./routes/fileRouter");
app.use("/files", fileRouter);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`App listening at http://localhost:${PORT}`);
});
