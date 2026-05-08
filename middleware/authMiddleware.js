const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, access denied" });
  }

  try {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Invalid token format" });
    }

    // ✅ use env secret (IMPORTANT)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next(); // ✅ FIXED (removed x)
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};