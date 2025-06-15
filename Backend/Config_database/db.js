const mysql = require("mysql2/promise");

// Create a connection pool to the MySQL database
const connectDB = mysql.createPool({
  host: "localhost",
  user: "root", // Change this to your MySQL username
  password: "root", // Change this to your MySQL password
  database: "event_management_systemdb",
  waitForConnections: true,
});

connectDB.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the MySQL database:", err);
  } else {
    console.log(
      "Connected to the MySQL database called event_management_systemdb"
    );
    connection.release();
  }
});

module.exports = connectDB;
