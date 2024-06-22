const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const watchlistRouter = require("./routes/watchlist");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const cookieParser = require("cookie-parser");
const commentRouter = require("./routes/comment");

const app = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: "https://bybit-alpha.vercel.app", // Replace with your frontend URL
  credentials: true, // This is important for cookies to be included
};

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(watchlistRouter);
app.use(authRouter);
app.use(postRouter);
app.use(commentRouter);

// MongoDB connection
const mongoURI =
  "mongodb+srv://sahillyadav:RgsytuS8E62ldsIG@encrypto.jp0wwqt.mongodb.net/?retryWrites=true&w=majority&appName=Encrypto";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
