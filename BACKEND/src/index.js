const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  "http://localhost:5173",
  "https://bachhoaxanh-nhjxtxp2q-xuan-hung-djinhhs-projects.vercel.app",
  
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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
