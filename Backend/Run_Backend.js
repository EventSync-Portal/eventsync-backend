require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const loginRoutes = require("./routes/loginRoutes");
const adminRoutes = require("./routes/AdminRoutes");
const eventOrganizerRoutes = require("./routes/EventOrganizerRoutes");
const cors = require("cors");


// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded data

// Global middleware to log all incoming request bodies
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Calling the routes
app.use("/ems/createUser", userRoutes);
app.use("/ems/login", loginRoutes);
// Use the admin routes with the /admin prefix
app.use('/ems/admin', adminRoutes);

// Use the event organizer routes with the  /eventOrginazer prefix
app.use('/ems/eventOrginazer', eventOrganizerRoutes);


// Define the port (use environment variable or default to 5000)
const port = process.env.port || 5000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
