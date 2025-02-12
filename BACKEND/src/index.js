const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors())
app.use(express.json());
app.use(cookieParser());


app.get("/", (req, res) => {
  return res.send("hello");
});


routes(app);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect DB successfully");
  })
  .catch((err) => {
    console.log("Error connect DB", err);
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
