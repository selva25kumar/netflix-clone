// Handles register, login and getting logged-in user's profile
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// helper function to create a JWT token for a user id
const generateToken = (id) => {
  const jwtSecret = process.env.JWT_SECRET || "change_this_to_a_random_secret_key";
  return jwt.sign({ id }, jwtSecret, { expiresIn: "7d" });
};

// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      myList: user.myList,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route GET /api/auth/profile (protected)
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/auth/mylist (protected) - add/remove movie from My List
const updateMyList = async (req, res) => {
  try {
    const { movieId } = req.body;
    const user = await User.findById(req.userId);

    if (user.myList.includes(movieId)) {
      // already in list -> remove it
      user.myList = user.myList.filter((id) => id !== movieId);
    } else {
      // not in list -> add it
      user.myList.push(movieId);
    }

    await user.save();
    res.json({ myList: user.myList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateMyList };
