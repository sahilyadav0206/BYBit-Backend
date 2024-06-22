const express = require("express");
const UserData = require("../models/UserData");
const router = new express.Router();
const { requireAuth } = require("../middleware/auth");

// Route to add a coin to the watchlist
router.put("/watchlist/add", requireAuth, async (req, res) => {
  try {
    const { coinId } = req.body;
    console.log(req.user);
    const userData = await UserData.findOne({ userId: req?.user?._id });

    if (!userData) {
      return res.status(404).send("User data not found");
    }

    if (!userData.mywatchlist.includes(coinId)) {
      userData.mywatchlist.push(coinId);
      await userData.save();
      res.status(200).send("Coin added to watchlist");
    } else {
      res.status(400).send("Coin already in watchlist");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to remove a coin from the watchlist
router.put("/watchlist/remove", requireAuth, async (req, res) => {
  try {
    const { coinId } = req.body;
    const userData = await UserData.findOne({ userId: req.user._id });

    if (!userData) {
      return res.status(404).send("User data not found");
    }

    const index = userData.mywatchlist.indexOf(coinId);
    if (index > -1) {
      userData.mywatchlist.splice(index, 1);
      await userData.save();
      res.status(200).send("Coin removed from watchlist");
    } else {
      res.status(400).send("Coin not found in watchlist");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Route to get the user's watchlist
router.get("/watchlist", requireAuth, async (req, res) => {
  try {
    const userData = await UserData.findOne({ userId: req.user._id });
    if (!userData) {
      return res.status(404).send("UserData not found");
    }

    res.send(userData.mywatchlist);
  } catch (error) {
    res.status(400).send("Error fetching watchlist: " + error.message);
  }
});

module.exports = router;
