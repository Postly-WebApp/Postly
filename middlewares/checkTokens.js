const jwt = require("jsonwebtoken");

const blacklist = new Set();

// Middleware to check if the token is blacklisted
function checkBlacklist(req, res, next) {
  //const token = req.cookies.jwt;
  const token = req.headers.cookie.split("=")[1];
  token = token.split(";")[0];
  //console.log(actualToken.split(";")[0]);
  if (blacklist.has(token)) {
    return res.status(401).json({ message: "Token has been revoked" });
  }
  next();
}

module.exports = checkBlacklist;
