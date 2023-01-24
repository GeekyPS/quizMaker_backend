const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const userInfo = require("./userDetails");
const auth = require("./middlewares/auth");
const passport = require("passport");

const JWT_SECRET =
  "hrwli4eo787y32o8uqr9[(kwhdaafwdkkhvf()fheiwdjsvd[]kjwdcjh{}";
const MONGOURL =
  "mongodb+srv://Priyanshu:IzdQ46dZ1KramfQC@cluster0.0ydw6sl.mongodb.net/Quiz?retryWrites=true&w=majority";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

const isLoggedIn = async (req, res, next) => {
  const decodedJwt = jwt.decode(req.cookies.token, JWT_SECRET);
  if (decodedJwt) {
    const id = decodedJwt.id;

    let user = await userInfo.findById(id).exec();
    user.password = undefined;

    req.user = user;
  }

  if (req.user) {
    res.send({ status: "already logged in", user: req.user });
  } else {
    next();
  }
};

app.post("/login", isLoggedIn, async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);



  if (!email || !password) {
    res.status(400).send({ error: "BAD_REQUEST" });
  }
  const user = await userInfo.findOne({ email: email }).exec();
  if (!user) {

    return res.status(401).send({
      error: "User with given email not found",
    });
  }

  let passwordCorrect = await bcrypt.compare(password, user.password);

  if (passwordCorrect) {
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "2h" });
    res.cookie("token", token);
    res.status(201).send({ status: "ok", token: token });
  } else {
    res.status(401).send({
      error: "Password is incorrect",
    });
  }
});

app.post("/register", async (req, res, next) => {
  const { fname, lname, email, password } = req.body;

  if (!fname || !lname || !email || !password) {
    return res.status(400).send({ error: "BAD_REQUEST" });
  }
  const olduser = await userInfo.findOne({ email: email }).exec();

  if (olduser) {
    return res.status(409).send({
      error: "User with the given email id already exists",
    });
  }
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const userData = new userInfo({
      fname,
      lname,
      email,
      password: encryptedPassword,
    });
    await userData.save();
    return res.status(201).send({ status: "ok" });
  } catch (error) {
    res.status(404).send({ status: "error" });
  }
});


mongoose.set({ strictQuery: false });
mongoose
  .connect(MONGOURL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");

    app.listen(7800, () => {
      console.log("running at port 7800");
    });
  })
  .catch((e) => console.log(e));
