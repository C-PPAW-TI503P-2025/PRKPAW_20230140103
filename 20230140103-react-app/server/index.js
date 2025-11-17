const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// middleware
app.use(cors());
app.use(express.json()); // <= biar bisa baca req.body JSON

// "database" sederhana di memory
const users = [];

// GET root
app.get("/", (req, res) => {
  res.json({ message: "Hello ini teh Server!" });
});

// GET /hello (punya lo tadi, biarin aja kalau mau)
app.get("/hello", (req, res) => {
  const name = String(req.query.name || "").trim();
  res.json({ message: name ? `Hello, ${name}!` : "Hello!" });
});

// ========================
//  POST /api/auth/register
// ========================
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    return res.status(400).json({ message: "Email sudah terdaftar." });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    password, // untuk tugas boleh plain text, di real project harus di-hash
    role,
  };

  users.push(newUser);

  return res.status(201).json({
    message: "Register berhasil.",
  });
});

// =====================
//  POST /api/auth/login
// =====================
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "Email atau password salah." });
  }

  // "token" dummy buat disimpan di localStorage
  const token = `dummy-token-${user.id}-${Date.now()}`;

  return res.json({
    message: "Login berhasil.",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
