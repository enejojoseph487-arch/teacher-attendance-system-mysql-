const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("./database");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the website
app.use(express.static("public"));

// ===============================
// HOME PAGE
// ===============================

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// ===============================
// LOGIN
// ===============================

app.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  // Check that all fields were entered
  if (!email || !password || !role) {
    return res.status(400).json({
      success: false,
      message: "Please fill in all fields",
    });
  }

  const sql = `
        SELECT * FROM users
        WHERE email = ? AND role = ?
    `;

  db.query(sql, [email, role], async (err, results) => {
    if (err) {
      console.log("Database error:", err);

      return res.status(500).json({
        success: false,
        message: "Database error",
      });
    }

    // User does not exist
    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password or role",
      });
    }

    const user = results[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email, password or role",
      });
    }

    console.log("LOGGED IN USER:", user);
    console.log("USER ROLE:", user.role);

    // ADMIN
    if (user.role === "admin") {
      console.log("REDIRECTING ADMIN TO ADMIN PAGE");

      return res.json({
        success: true,
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // TEACHER
    console.log("REDIRECTING TEACHER TO DASHBOARD");

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
});

// ===============================
// TEACHER SIGN IN
// ===============================

app.post("/attendance/sign-in", (req, res) => {
  console.log("SIGN-IN ROUTE WAS CALLED!");

  const { teacherId } = req.body;

  // Check if this teacher has already signed in today
  const checkSql = `
        SELECT *
        FROM attendance
        WHERE teacher_id = ?
        AND date = CURDATE()
        LIMIT 1
    `;

  db.query(checkSql, [teacherId], (err, results) => {
    if (err) {
      console.log("Check sign-in error:", err);

      return res.status(500).json({
        success: false,
        message: "Unable to check attendance",
      });
    }

    // Teacher already has an attendance record today
    if (results.length > 0) {
      return res.json({
        success: false,
        message: "You have already signed in today.",
      });
    }

    // No attendance record today, so create one
    const insertSql = `
            INSERT INTO attendance
            (teacher_id, date, sign_in, status)
            VALUES (?, CURDATE(), CURTIME(), 'Present')
        `;

    db.query(insertSql, [teacherId], (err, result) => {
      if (err) {
        console.log("Sign-in error:", err);

        return res.status(500).json({
          success: false,
          message: "Unable to sign in",
        });
      }

      console.log("Teacher signed in successfully");

      return res.json({
        success: true,
        message: "Sign in successful!",
      });
    });
  });
});
// ===============================
// TEACHER SIGN OUT
// ===============================
app.post("/attendance/sign-out", (req, res) => {
  console.log("SIGN-OUT ROUTE WAS CALLED!");

  const { teacherId } = req.body;

  // Find today's attendance record
  const checkSql = `
        SELECT *
        FROM attendance
        WHERE teacher_id = ?
        AND date = CURDATE()
        LIMIT 1
    `;

  db.query(checkSql, [teacherId], (err, results) => {
    if (err) {
      console.log("Check sign-out error:", err);

      return res.status(500).json({
        success: false,
        message: "Unable to check attendance",
      });
    }

    // Teacher has not signed in today
    if (results.length === 0) {
      return res.json({
        success: false,
        message: "You must sign in before you can sign out.",
      });
    }

    const attendance = results[0];

    // Teacher already signed out
    if (attendance.sign_out) {
      return res.json({
        success: false,
        message: "You have already signed out today.",
      });
    }

    // Teacher has signed in but hasn't signed out yet
    const updateSql = `
            UPDATE attendance
            SET sign_out = CURTIME()
            WHERE teacher_id = ?
            AND date = CURDATE()
            AND sign_out IS NULL
        `;

    db.query(updateSql, [teacherId], (err, result) => {
      if (err) {
        console.log("Sign-out error:", err);

        return res.status(500).json({
          success: false,
          message: "Unable to sign out",
        });
      }

      console.log("Teacher signed out successfully");

      return res.json({
        success: true,
        message: "Sign out successful!",
      });
    });
  });
});

// ===============================
// TEACHER - GET TODAY'S ATTENDANCE
// ===============================

app.get("/attendance/today/:teacherId", (req, res) => {
  const teacherId = req.params.teacherId;

  const sql = `
        SELECT sign_in, sign_out, status
        FROM attendance
        WHERE teacher_id = ?
        AND date = CURDATE()
        LIMIT 1
    `;

  db.query(sql, [teacherId], (err, results) => {
    if (err) {
      console.log("Attendance error:", err);

      return res.status(500).json({
        success: false,
        message: "Unable to get attendance",
      });
    }

    if (results.length === 0) {
      return res.json({
        success: true,
        attendance: null,
      });
    }

    res.json({
      success: true,
      attendance: results[0],
    });
  });
});

// ===============================
// ADMIN - VIEW TODAY'S ATTENDANCE
// ===============================

// ===============================
// ADMIN - VIEW ALL ATTENDANCE
// ===============================

app.get("/admin/attendance", (req, res) => {
  const sql = `
    SELECT 
      users.name,
      attendance.date,
      attendance.sign_in,
      attendance.sign_out,
      attendance.status
    FROM attendance
    INNER JOIN users
      ON attendance.teacher_id = users.id
    ORDER BY attendance.date DESC, attendance.sign_in ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Attendance error:", err);

      return res.status(500).json({
        success: false,
        message: "Unable to get attendance",
      });
    }

    res.json({
      success: true,
      attendance: results,
    });
  });
});

app.get("/admin/attendance/today", (req, res) => {
  const sql = `
    SELECT
      users.id,
      users.name,
      users.email,
      attendance.sign_in,
      attendance.sign_out,
      COALESCE(attendance.status, 'Absent') AS status
    FROM users
    LEFT JOIN attendance
      ON users.id = attendance.teacher_id
      AND attendance.date = CURDATE()
    WHERE users.role = 'teacher'
    ORDER BY users.name ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Today's attendance error:", err);
      return res.status(500).json({
        success: false,
        message: "Unable to get today's attendance.",
      });
    }

    res.json({
      success: true,
      attendance: results,
    });
  });
});
// Get all teachers
app.get("/admin/teachers", (req, res) => {
  const sql = `
    SELECT id, name, email
    FROM users
    WHERE role = 'teacher'
    ORDER BY name ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log("Teachers error:", err);

      return res.status(500).json({
        success: false,
        message: "Unable to get teachers",
      });
    }

    res.json({
      success: true,
      teachers: results,
    });
  });
});
// Add a new teacher
app.post("/admin/add-teacher", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Please fill in all fields.",
    });
  }

  try {
    // Check if email already exists
    const checkSql = "SELECT id FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.log("Check teacher error:", err);

        return res.status(500).json({
          success: false,
          message: "Unable to check teacher.",
        });
      }

      if (results.length > 0) {
        return res.json({
          success: false,
          message: "A user with this email already exists.",
        });
      }

      // Hash the password

      const hashedPassword = await bcrypt.hash(password, 10);

      const insertSql = `
        INSERT INTO users (name, email, password, role)
        VALUES (?, ?, ?, 'teacher')
      `;

      db.query(insertSql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.log("Add teacher error:", err);

          return res.status(500).json({
            success: false,
            message: "Unable to add teacher.",
          });
        }

        res.json({
          success: true,
          message: "Teacher added successfully!",
        });
      });
    });
  } catch (error) {
    console.log("Password hashing error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
});
// Admin - Edit teacher
app.put("/admin/edit-teacher/:id", async (req, res) => {
  const teacherId = req.params.id;
  const { name, email } = req.body;

  if (!name || !email) {
    return res.json({
      success: false,
      message: "Please provide a name and email.",
    });
  }

  const sql = `
    UPDATE users
    SET name = ?, email = ?
    WHERE id = ? AND role = 'teacher'
  `;

  db.query(sql, [name, email, teacherId], (err, result) => {
    if (err) {
      console.log("Edit teacher error:", err);

      return res.status(500).json({
        success: false,
        message: "Unable to edit teacher.",
      });
    }

    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "Teacher not found.",
      });
    }

    res.json({
      success: true,
      message: "Teacher updated successfully!",
    });
  });
});

// Admin - Delete teacher
app.delete("/admin/delete-teacher/:id", (req, res) => {
  const teacherId = req.params.id;

  const sql = `
    DELETE FROM users
    WHERE id = ? AND role = 'teacher'
  `;

  db.query(sql, [teacherId], (err, result) => {
    if (err) {
      console.log("Delete teacher error:", err);

      return res.status(500).json({
        success: false,
        message: "Unable to delete teacher.",
      });
    }

    if (result.affectedRows === 0) {
      return res.json({
        success: false,
        message: "Teacher not found.",
      });
    }

    res.json({
      success: true,
      message: "Teacher deleted successfully!",
    });
  });
});

// Admin - view today's attendance including absent teachers
// ===============================
// ADMIN - ATTENDANCE HISTORY
// ===============================

app.get("/admin/attendance/history", (req, res) => {
  const date = req.query.date;

  if (!date) {
    return res.status(400).json({
      success: false,
      message: "Please provide a date.",
    });
  }

  const sql = `
    SELECT
      users.id,
      users.name,
      users.email,
      attendance.sign_in,
      attendance.sign_out,
      COALESCE(attendance.status, 'Absent') AS status
    FROM users
    LEFT JOIN attendance
      ON users.id = attendance.teacher_id
      AND attendance.date = ?
    WHERE users.role = 'teacher'
    ORDER BY users.name ASC
  `;

  db.query(sql, [date], (err, results) => {
    if (err) {
      console.log("Attendance history error:", err);

      return res.status(500).json({
        success: false,
        message: "Unable to get attendance history.",
      });
    }

    res.json({
      success: true,
      date: date,
      attendance: results,
    });
  });
});
// ===============================
// START SERVER
// ===============================
app.get("/health", (req, res) => {
  db.query("SELECT COUNT(*) AS n FROM users", (err, rows) => {
    res.json({ error: err ? err.message : null, rows });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
// cd teacher-attendance-system
