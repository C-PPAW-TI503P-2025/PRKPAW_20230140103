import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// impor animasi yang sama kayak di App
import SplitText from "../SplitText";
import Magnet from "../Magnet";
import "../App.css";

const handleAnimationComplete = () => {
  console.log("Login title animated!");
};

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // teks judul yang ikut berubah & dianimasikan
  const greeting = `Welcome${email ? `, ${email}` : " back!"}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      const token = response.data.token;
      localStorage.setItem("token", token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response ? err.response.data.message : "Login gagal");
    }
  };

  return (
    <div className="app">
      <Magnet padding={300} disabled={false} magnetStrength={10}>
        <div className="container">
          {/* Title pakai SplitText, animasi & warna dari App.css */}
          <SplitText
            key={email}
            text={greeting}
            className="title"
            delay={100}
            duration={2}
            ease="elastic.out(1,0.3)"
            splitType="words"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />

          {/* Form login */}
          <form
            onSubmit={handleSubmit}
            className="space-y-4 w-full max-w-md mx-auto mt-8"
          >
            <div className="text-left">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white/80"
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-md 
                  bg-white/10 border border-white/30 
                  text-white placeholder-white/50
                  focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="email kamu"
              />
            </div>

            <div className="text-left">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white/80"
              >
                Password:
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full px-3 py-2 rounded-md 
                  bg-white/10 border border-white/30 
                  text-white placeholder-white/50
                  focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 font-semibold rounded-md
                bg-emerald-400 text-gray-900 shadow-md hover:bg-emerald-300
                transition-all"
            >
              Login
            </button>
          </form>

          {error && (
            <p className="text-red-300 text-sm mt-4 text-center">{error}</p>
          )}
        </div>
      </Magnet>
    </div>
  );
}

export default LoginPage;
