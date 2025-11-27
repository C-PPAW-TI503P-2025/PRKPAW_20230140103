const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  // Ambil header Authorization: Bearer <token>
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Token tidak ditemukan. Silakan login kembali." });
  }

  // Verifikasi token
  jwt.verify(token, process.env.JWT_SECRET || "rahasia_jwt", (err, user) => {
    if (err) {
      console.error(err);
      return res
        .status(403)
        .json({ message: "Token tidak valid atau sudah kadaluarsa." });
    }

    // payload token disimpan di req.user
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
