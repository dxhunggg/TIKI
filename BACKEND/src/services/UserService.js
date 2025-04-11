const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser != null) {
        resolve({
          status: "ERR",
          message: "Email is already registered",
        });
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "User created successfully.",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined.",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);
      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "Incorrect password.",
        });
        return;
      }
      const access_token = await generalAccessToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await generalRefreshToken({
        id: checkUser.id,
        isAdmin: checkUser.isAdmin,
      });
      {
        resolve({
          status: "OK",
          message: "Login successfully.",
          access_token,
          refresh_token,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        resolve({
          status: "OK",
          message: "The user is not defined.",
        });
        return;
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "Success",
        data: updatedUser,
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to update user.",
        error: error,
      });
    }
  });
};

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        resolve({
          status: "OK",
          message: "The user is not defined.",
        });
        return;
      }

      await User.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to delete user.",
        error: error,
      });
    }
  });
};

const deleteManyUsers = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await User.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete user success",
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to delete user.",
        error: error,
      });
    }
  });
};
const getAllUsers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUsers = await User.find();
      resolve({
        status: "OK",
        message: "Success",
        data: allUsers,
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to get all users.",
        error: error,
      });
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ _id: id });

      if (!user) {
        resolve({
          status: "OK",
          message: "The user is not defined.",
        });
      }

      resolve({
        status: "OK",
        message: "Success",
        data: user,
      });
    } catch (error) {
      reject({
        status: 500,
        message: "Failed to delete user.",
        error: error,
      });
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getDetailsUser,
  deleteManyUsers,
};
