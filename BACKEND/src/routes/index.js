const UserRoute = require("./UserRouter");

const routes = (app) => {
  app.use("/api/user", UserRoute);
};

module.exports = routes;
