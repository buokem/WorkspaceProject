const jwt = require('jsonwebtoken');
const User = require("../../models/User");
require('dotenv').config();

async function verifyUser(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!password) return res.status(400).json({ error: 'Password is required' });

    // Tìm user theo email
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    // So sánh password (nếu dùng bcrypt thì thay đổi ở đây)
    if (user.password !== password) {
      return res.status(400).json({ error: "Wrong credentials, try again" });
    }

    const role = user.role;
    const id = user.id;

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { sub: id, email, role },
      process.env.JWT_SECRET,
      { expiresIn: '15m', issuer: 'watchspaces' }
    );

    return res.status(200).json({
      message: 'Successful LogIn',
      user: { id, email, role },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error." });
  }
}

module.exports = verifyUser;
