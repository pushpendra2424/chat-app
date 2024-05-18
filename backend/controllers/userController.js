const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  let { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    throw new Error("Please enter all the fields.");
  }
  email = email.trim().toLowerCase();
  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new Error("User already exist.");
  }

  const userCreate = await User.create({
    name,
    email,
    password,
    pic: pic || undefined,
  });

  if (userCreate) {
    res.status(201).send({
      _id: userCreate._id,
      name: userCreate.name,
      email: userCreate.email,
      pic: userCreate.pic,
      token: generateToken(userCreate._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user.");
  }
});

const authUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  if (!email || !password) {
    throw new Error("Please enter all the fields.");
  }

  email = email.trim().toLowerCase();

  const userData = await User.findOne({ email });

  if (userData && (await userData.matchPassword(password))) {
    return res.status(200).send({
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      // isAdmin: userData.isAdmin,
      pic: userData.pic,
      token: generateToken(userData._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password"); // Exclude the 'password' field from the query result

  return res.status(200).send(users);
});

module.exports = {
  registerUser,
  authUser,
  allUsers,
};
