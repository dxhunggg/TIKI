const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided", status: "ERR" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid token", status: "ERR" });
      }

      if (user?.isAdmin) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "Access denied", status: "ERR" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", status: "ERR" });
  }
};

const authUserMiddleware = (req, res, next) => {
  try {
    const token = req.headers.token?.split(" ")[1];
    const userId = req.params.id;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided", status: "ERR" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ message: "Invalid token", status: "ERR" });
      }
      if (user?.isAdmin || user?.id === userId) {
        next();
      } else {
        return res
          .status(403)
          .json({ message: "Access denied", status: "ERR" });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", status: "ERR" });
  }
};
module.exports = { authMiddleware, authUserMiddleware };
