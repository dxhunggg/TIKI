const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleware } = require("../../middleware/authMiddleware");

// Phương thức POST để tạo người dùng
router.post("/sign-up", userController.createUser);

router.post("/sign-in", userController.loginUser);

router.put("/update-user/:id", userController.updateUser);

router.delete("/delete-user/:id", authMiddleware ,userController.deleteUser);

router.get("/getAll", authMiddleware, userController.getAllUsers);

router.get("/get-details/:id", userController.getDetailsUser);


// Phương thức GET để kiểm tra kết nối
router.get("/", (req, res) => {
  res.status(200).json({ message: "User route is working with GET!" });
});

module.exports = router;
