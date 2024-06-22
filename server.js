const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const watchlistRouter = require("./routes/watchlist");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const cookieParser = require("cookie-parser");

const app = express();

const port = process.env.PORT || 8080;

const corsOptions = {
  origin: "http://localhost:3000", // Replace with your frontend URL
  credentials: true, // This is important for cookies to be included
};

// Middleware
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(watchlistRouter);
app.use(authRouter);
app.use(postRouter);

// MongoDB connection
const mongoURI =
  "mongodb+srv://sahillyadav:RgsytuS8E62ldsIG@encrypto.jp0wwqt.mongodb.net/?retryWrites=true&w=majority&appName=Encrypto";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
