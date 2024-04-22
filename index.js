const express = require("express");
const app = express();
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
dotenv.config();
app.listen(5000, () => console.log(`listining in port 5000....`));
mongoose.connect("mongodb+srv://Sawy:Zyad1234@cluster0.ykwk8jf.mongodb.net/");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
// middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
