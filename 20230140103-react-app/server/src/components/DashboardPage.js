import React from 'react';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const navigate = useNavigate();

  // ⚡ Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("token");  // hapus token
    navigate("/login");                // redirect ke login
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 
      bg-gradient-to-br from-[#0b1b13] via-[#0f2a1d] to-[#123826]">

      <div className="p-10 rounded-2xl shadow-xl text-center 
        backdrop-blur-md bg-white/10 border border-white/20 max-w-md w-full">

        <h1 className="text-4xl font-extrabold text-[#17b169] mb-4">
          Dashboard Forest 🌲
        </h1>

        <p className="text-[#cbe8d9] mb-8">Selamat datang di dashboardmu, brok!</p>

        <button
          onClick={handleLogout}
          className="py-2.5 px-7 rounded-lg font-semibold 
          bg-[#17b169] text-white hover:bg-[#13985a] shadow-md"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default DashboardPage;
