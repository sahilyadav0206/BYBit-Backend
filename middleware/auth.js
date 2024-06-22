const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const jwtSecret = "BuyBitEncryptoSahilYadav";

const requireAuth = (req, res, next) => {
  const authToken = req.cookies.authToken;

  // Check if authToken exists
  if (authToken) {
    jwt.verify(authToken, jwtSecret, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.status(401).send("Unauthorized");
      } else {
        const user = await Users.findById(decodedToken.userId);
        if (!user) {
          res.status(404).send("User not found");
        } else {
          req.user = user; // Attach user object to request object
          next(); // Proceed to the next middleware or route handler
        }
      }
    });
  } else {
    res.status(401).send("Unauthorized");
  }
};

module.exports = { requireAuth };
