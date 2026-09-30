// const mysql = require("mysql2");

// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "Enejo",
//     database: "attendance_system"
// });

// db.connect((err) => {
//     if (err) {
//         console.error("Database connection failed:", err.message);
//         return;
//     }

//     console.log("Connected to MySQL successfully!");
// });
require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,

  ssl:
    process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }

  console.log("Connected to MySQL successfully!");
});

module.exports = db;
