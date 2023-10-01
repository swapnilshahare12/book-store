const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  loginUser,
  registerUser,
  subscribeNewsletter,
  userAuth,
} = require("../controllers/usercontroller");

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

const storage = multer.diskStorage({});

let upload = multer({ storage });

router.post("/login-user", loginUser);
router.post("/register-user", upload.single("profilePicture"), registerUser);
router.post("/user-auth", userAuth);
router.post("/subscribe-newsletter", subscribeNewsletter);

module.exports = router;
