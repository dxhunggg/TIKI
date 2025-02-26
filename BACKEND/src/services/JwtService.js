const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const generalAccessToken = async (payload) => {
  const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
    expiresIn: "10s",
  });
  return access_token;
};

const generalRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN, {
    expiresIn: "365d",
  });
  return refresh_token;
};

const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, decoded) => {
        if (err) {
          console.error("Token verification error:", err.message);
          return resolve({
            status: "ERR",
            message: "Authentication failed. Token is invalid or has expired.",
          });
        }
        // Chờ kết quả của generalAccessToken
        const access_token = await generalAccessToken({
          id: decoded?.id,
          isAdmin: decoded?.isAdmin,
        });
        console.log(access_token);
        return resolve({
          status: "OK",
          message: "Token refreshed successfully.",
          access_token,
        });
      });
    } catch (e) {
      console.error("Unexpected error:", e.message);
      return reject({
        status: "ERR",
        message: "An error occurred while refreshing the token.",
        error: e,
      });
    }
  });
};

module.exports = {
  generalAccessToken,
  generalRefreshToken,
  refreshTokenJwtService,
};
