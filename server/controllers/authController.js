const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log(`📨 Signup attempt → Email: ${email}, Username: ${username}`);

    // Check for existing email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Check for existing username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(201).json({ user, token });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate field error" });
    }

    console.error("❌ SIGNUP ERROR:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`🔐 Login attempt → Email: ${email}`);

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ user, token });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};
