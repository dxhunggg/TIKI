const UserRoute = require("./UserRouter");

const routes = (app) => {
  // Sử dụng app.use() để gắn router
  app.use("/api/user", UserRoute);
};

module.exports = routes;
