const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../Config_database/db");
const { sendEmail } = require("../toolSetting/emailer");

const otpStore = {}; // Temporary in-memory store for OTPs

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Check if the user exists
    const [userResult] = await db.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (userResult.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult[0];

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiration (2 minutes)
    otpStore[username] = {
      otp,
      expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes in milliseconds
    };

    // Send OTP to user's email
    await sendEmail(
      username,
      "The OTP Code.",
      `Your OTP code is ${otp}. It will expire in 2 minutes.`,
      `<p>Your OTP code is <b>${otp}</b>. It will expire in <b>2 minutes</b>.</p>`
    );

    res.status(200).json({ message: "OTP sent to your email. Please verify." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { username, otp } = req.body;

  if (!username || !otp) {
    return res.status(400).json({ message: "Username and OTP are required" });
  }

  const storedOtpData = otpStore[username];

  if (!storedOtpData) {
    return res.status(400).json({ message: "OTP not found or expired" });
  }

  if (Date.now() > storedOtpData.expiresAt) {
    delete otpStore[username];
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (storedOtpData.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // If OTP is correct
  delete otpStore[username]; // Remove OTP after successful verification

  try {
    const [userResult] = await db.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );

    if (userResult.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult[0];

    // Create JWT Token valid for 1 hour
    const token = jwt.sign(
      {
        user: {
          id: user.id,
          username: user.username,
          roleID: user.roleID,
        },
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" } // Token expires after 1 hour
    );

    res.status(200).json({ message: "OTP verified successfully", token });
  } catch (error) {
    console.error("Error creating token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
