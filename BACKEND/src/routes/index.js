const UserRoute = require("./UserRouter");
const routes = (app) => {
  app.get("/api/user", UserRoute);
};

module.exports = routes;
