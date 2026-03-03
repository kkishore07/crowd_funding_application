const express = require("express");
const { register, login, getUsers } = require("../controller/authController");
const { verifyTokenAndAdmin } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", verifyTokenAndAdmin, getUsers);

module.exports = router;
