const bcrypt = require("bcryptjs");
const db = require("./database");

async function createUser() {
  const name = "Admin";
  const email = "admin@gmail.com";
  const password = "admin123";
  const role = "admin";

  const hashedPassword = await bcrypt.hash(password, 10);

  const sql = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, ?)
    `;

  db.query(sql, [name, email, hashedPassword, role], (err, result) => {
    if (err) {
      console.error("Error creating user:", err);
      return;
    }

    console.log("Admin account created successfully!");

    db.end();
  });
}

createUser();
