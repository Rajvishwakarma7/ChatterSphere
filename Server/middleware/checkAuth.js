const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let isVarify = jwt.verify(token, "raj 28");
    if (isVarify) {
      next();
    }
  } catch (err) {
    return res.status(401).json({ msg: "invalid Token try again" });
  }
};
