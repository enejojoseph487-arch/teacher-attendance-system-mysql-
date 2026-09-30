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
const mysql = require("mysql2");

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Enejo",
  database: process.env.DB_NAME || "attendance_system",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  // Most hosted MySQL providers require SSL. Set DB_SSL=true on Render.
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
});

db.getConnection((err, conn) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    return;
  }
  console.log("Connected to MySQL successfully!");
  conn.release();
});

module.exports = db;