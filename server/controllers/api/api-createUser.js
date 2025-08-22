const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../../models/User");

async function createUser(req, res) {
  try {
    const userData = req.body || {};
    const { email, role } = userData;

    if (!email) return res.status(400).json({ error: "Email is required." });
    if (!role) return res.status(400).json({ error: "Role is required." });

    // Check if email exists
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already exists." });


    // Create user in MongoDB
    const newUser = new User(userData);

    await newUser.save();

    // JWT secret check
    if (!process.env.JWT_SECRET) {
      return res
        .status(500)
        .json({ error: "JWT secret not configured on server." });
    }

    // Sign JWT
    const token = jwt.sign(
      { sub: newUser._id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: "15m", issuer: "watchspaces" }
    );

    res.cookie('session', token, {
      httpOnly: true,
      secure: true,       
      sameSite: 'None',   // cross-site (github.io -> onrender.com)
      path: '/',
      maxAge: 1000 * 60 * 60 * 24
    });

    return res.status(201).json({
      message: "User created.",
      user: { id: newUser._id, email, role },
      token,
    });

  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: err.message || "Server error." });
  }
}

module.exports = createUser;
