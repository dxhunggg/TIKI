const jwt = require("jsonwebtoken");

const generalAccessToken = async (payload) => {
  const accessToken = jwt.sign(
    payload,
    "access_token",
    { expiresIn: "1h" }
  );
  return accessToken;
};

const generalRefreshToken = async (payload) => {
  const accessToken = jwt.sign(
    payload,
    "refresh_token",
    { expiresIn: "365d" }
  );
  return accessToken;
};

module.exports = { generalAccessToken, generalRefreshToken }; 
