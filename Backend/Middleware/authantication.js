const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(403).json({ message: "Access Denied!" });
  const token = authHeader.split(" ")[1];
  console.log("\n\n" + token);
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified.user;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};
