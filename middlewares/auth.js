const jwt = require("jsonwebtoken");

const JWT_SECRET =
  "hrwli4eo787y32o8uqr9[(kwhdaafwdkkhvf()fheiwdjsvd[]kjwdcjh{}";

const auth = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(403).send("Please login first");
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

  } catch (e) {
    console.log(e);
    res.status(401).send('invalid token')
  }

  next();
};

module.exports = auth;
