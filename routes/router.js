const express = require("express");
const router = express.Router();
const loginRegister = require("../controllers/LoginRegisterController");
const post = require("../controllers/postController");
const friendRequest = require("../controllers/friendController");
const multer = require("multer");
const checkAuth = require("../controllers/check_Auth");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/[\/\\:]/g, "_") + file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/register", loginRegister.postRegister);
router.post("/login", loginRegister.postLogin);
router.post("/forgotPassword", loginRegister.forgotPassword);
router.post("/resetPassword", loginRegister.resetPassword);
router.post(
  "/updateUser",
  checkAuth,
  upload.single("productImage"),
  loginRegister.updateUser
);
router.post("/createPost", checkAuth, post.postPost);
router.get("/deletePost", checkAuth, post.deletePost);
router.get("/allRequest", checkAuth, friendRequest.allRequets);
router.post("/sendRequest", checkAuth, friendRequest.sendRequest);
router.post("/respondRequest", checkAuth, friendRequest.respondRequest);
router.get("/getFriend", friendRequest.getFriends);
router.post("/removeFriend", checkAuth, friendRequest.removeFriend);
router.get("/friendsOfFriends", checkAuth, friendRequest.fof);
router.get("/mutualFriend", checkAuth, friendRequest.mutualFriend);
module.exports = router;
