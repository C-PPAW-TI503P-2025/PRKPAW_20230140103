const { User } = require("../models");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    // cek email
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

    const newUser = await User.create({
      nama: name,
      email,
      password,  // NOTE: tanpa hash sesuai modul (boleh ditambah hash kalau mau)
      role,
    });

    return res.status(201).json({ message: "Register berhasil." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email, password },
    });

    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const payload = {
      id: user.id,
      nama: user.nama,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || "rahasia_jwt", {
      expiresIn: "1d",
    });

    res.json({
      message: "Login berhasil",
      token,
      user: payload,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
