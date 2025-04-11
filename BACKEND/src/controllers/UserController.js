const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
      return res
        .status(200)
        .json({ status: "ERR", message: "All fields user are required." });
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
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res
        .status(200)
        .json({ status: "ERR", message: "All fields user are required." });
    } else if (!isCheckEmail) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Invalid email format!" });
    }
    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false, // Set true if using HTTPS
      sameSite: "lax",
      path: "/",
    });
    return res.status(200).json(newResponse);
  } catch (error) {
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
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "User ID is required." });
    }

    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids) {
      return res
        .status(200)
        .json({ status: "ERR", message: "User ID is required." });
    }

    const response = await UserService.deleteManyUsers(ids);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await UserService.getAllUsers();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res
        .status(200)
        .json({ status: "ERR", message: "User ID is required." });
    }

    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refresh_token;
    if (!token) {
      return res
        .status(200)
        .json({ status: "ERR", message: "Token is required." });
    }
    const response = await JwtService.refreshTokenJwtService(token);

    return res.status(200).json(response);
  } catch (error) {
    return res.status(error.status || 500).json({
      status: "ERR",
      message: error.message || "Internal Server Error.",
      error: error.error || null,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.clearCookie("refresh-token");
    return res.status(200).json({
      status: "OK",
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(404).json({
      status: "ERR",
      message: "User not found.",
      error: error.error || null,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getDetailsUser,
  refreshToken,
  logoutUser,
  deleteMany,
};
