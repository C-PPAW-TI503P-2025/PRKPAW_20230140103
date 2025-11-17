import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [nama, setNama] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3001/api/auth/register", {
        email,
        nama,
        password,
      });

      alert("Register berhasil!");
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal register. Coba lagi brok!"
      );
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Create Account</h1>

        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              placeholder="Masukkan nama kamu"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-button-wrapper">
            <button type="submit" className="login-btn">
              Daftar
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
