const router = require("express").Router();
const userControl = require("../Controller/userController");
const authMiddleware = require("../Middleware/authantication");
const roleMiddleware = require("../Middleware/role");
const { sendEmail } = require("../toolSetting/emailer");

//Make all the user routes:
router.post(
  "/makeAdmin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  userControl.createAdmin
);
router.post("/makeEventOrginazer", userControl.createEventOrganizer);
router.post(
  "/makeStudent",
  (req, res, next) => {
    console.log("Request body at /makeStudent:", req.body);
    next();
  },
  userControl.createStudent
);

// Test email sending route
router.post("/testEmail", async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to || !subject) {
      return res
        .status(400)
        .json({ message: "Missing 'to' or 'subject' in request body" });
    }
    const info = await sendEmail(to, subject, text || "", html || "");
    res.status(200).json({ message: "Email sent successfully", info });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending test email:", error);
    res
      .status(500)
      .json({ message: "Failed to send email", error: error.message });

    console.log("Failed to send the email");
  }
});

module.exports = router;
