const readline = require("readline");
const bcrypt = require("bcryptjs");
const db = require("./database");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the new password for joseph@gmail.com: ", async (newPassword) => {
  if (!newPassword) {
    console.log("Password cannot be empty.");
    rl.close();
    db.end();
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = `
      UPDATE users
      SET password = ?
      WHERE email = 'joseph@gmail.com'
        AND role = 'teacher'
    `;

    db.query(sql, [hashedPassword], (err, result) => {
      if (err) {
        console.error("Password reset failed:", err.message);
      } else if (result.affectedRows === 0) {
        console.log("Joseph's account was not found.");
      } else {
        console.log("Joseph's password was reset successfully!");
      }

      db.end();
      rl.close();
    });
  } catch (error) {
    console.error("Error:", error.message);
    db.end();
    rl.close();
  }
});