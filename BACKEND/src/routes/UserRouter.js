const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// Phương thức POST để tạo người dùng
router.post("/sign-up", userController.createUser);

router.post("/sign-in", userController.loginUser);

router.put("/update-user/:id", userController.updateUser);



// Phương thức GET để kiểm tra kết nối
router.get("/", (req, res) => {
  res.status(200).json({ message: "User route is working with GET!" });
});

module.exports = router;
