const bcrypt = require("bcryptjs");

const password = "admin123";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.log("Error:", err);
    return;
  }

  console.log("Password:", password);
  console.log("New hash:", hash);
});
