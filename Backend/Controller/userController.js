const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../Config_database/db");
const { sendEmail } = require("../toolSetting/emailer");

const SECRET_KEY = process.env.SECRET_KEY;

console.log("SECRET_KEY:", SECRET_KEY ? "set" : "not set");

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY environment variable is not set");
}

// Create Admin
exports.createAdmin = async (req, res) => {
  const { username, password, profileImage } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
const [existingUser] = await db.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "Admin already exists, just login instead" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

await db.query(
      "INSERT INTO user (username, password, profileImage, roleID) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, profileImage, 3]
    );

    const token = jwt.sign({ username, role: "ADMIN" }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Send Email
    await sendEmail(
      username,
      "Admin Account Created",
      `Hello ${username}, your Admin account has been successfully created.`,
      `<p>Hello <strong>${username}</strong>, your Admin account has been successfully created.</p>`
    );

    res.status(201).json({ message: "Admin created successfully", token });
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create Event Organizer
exports.createEventOrganizer = async (req, res) => {
  const { username, password, profileImage, venueApproval } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
const [existingUser] = await db.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Event organizer already exists, just login instead",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

await db.query(
      "INSERT INTO user (username, password, profileImage, venueApproval, roleID) VALUES (?, ?, ?, ?, ?)",
      [username, hashedPassword, profileImage, venueApproval, 2]
    );

    const token = jwt.sign({ username, role: "EVENT_ORGINAZER" }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Send Email
    await sendEmail(
      username,
      "Event Organizer Account Created",
      `Hello ${username}, your Event Organizer account has been successfully created.`,
      `<p>Hello <strong>${username}</strong>, your Event Organizer account has been successfully created.</p>`
    );

    res
      .status(201)
      .json({ message: "Event organizer created successfully", token });
  } catch (error) {
    console.error("Error creating event organizer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create Student
exports.createStudent = async (req, res) => {
  let username, password, profileImage;
  try {
    if (!req.body) {
      console.warn('Warning: req.body is undefined in createStudent');
      return res.status(400).json({ message: "Request body is missing" });
    }
    ({ username, password, profileImage } = req.body);
  } catch (error) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
const [existingUser] = await db.query(
      "SELECT * FROM user WHERE username = ?",
      [username]
    );
    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ message: "Student already exists, just login instead" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

await db.query(
      "INSERT INTO user (username, password, profileImage, roleID) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, profileImage, 1]
    );

    const token = jwt.sign({ username, role: "STUDENT" }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Send Email
    await sendEmail(
      username,
      "Student Account Created",
      `Hello ${username}, your Student account has been successfully created.`,
      `<p>Hello <strong>${username}</strong>, your Student account has been successfully created.</p>`
    );

    res.status(201).json({ message: "Student created successfully", token });
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
