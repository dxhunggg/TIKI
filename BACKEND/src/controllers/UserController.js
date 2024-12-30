const UserService = require("../services/UserService");

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res
        .status(200)
        .json({ status: "ERR", message: "All fields are required." });
    } else if (!isCheckEmail) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Invalid email format!" });
    } else if (password != confirmPassword) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Passwords do not match." });
    }

    const response = await UserService.createUser({
      name,
      email,
      password,
      confirmPassword,
      phone,
    });
    return res.status(200).json(response);
  } catch (error) {
    // Xử lý lỗi trả về từ UserService
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!name || !email || !password || !confirmPassword || !phone) {
      return res
        .status(200)
        .json({ status: "ERR", message: "All fields are required." });
    } else if (!isCheckEmail) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Invalid email format!" });
    } else if (password != confirmPassword) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Passwords do not match." });
    }

    const response = await UserService.loginUser(req.body);
    return res.status(200).json(response);
  } catch (error) {
    // Xử lý lỗi trả về từ UserService
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "User ID is required." });
    }

    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (error) {
    // Xử lý lỗi trả về từ UserService
    console.error("Error in updateUser:", error); // Log lỗi để debug

    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

module.exports = { createUser, loginUser, updateUser };
