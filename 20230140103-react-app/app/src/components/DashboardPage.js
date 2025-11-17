import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ambil user dari localStorage
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // kalau ga ada user, langsung logout aja
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="app">
      <div className="container">
        {/* Title */}
        <h1 className="title">
          Welcome{user ? `, ${user.name}!` : "!"}
        </h1>

        <p className="mt-2 text-sm md:text-base text-gray-800/80">
          Anda login sebagai <b>{user?.role || "unknown role"}</b>
        </p>

        {/* Dashboard grid content */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-white/40 rounded-xl p-4 shadow-md">
            <h2 className="font-semibold mb-1 text-gray-900">Nama Akun</h2>
            <p className="text-sm text-gray-700">
              {user?.name}
            </p>
          </div>

          <div className="bg-white/40 rounded-xl p-4 shadow-md">
            <h2 className="font-semibold mb-1 text-gray-900">Email</h2>
            <p className="text-sm text-gray-700">
              {user?.email}
            </p>
          </div>

          <div className="bg-white/40 rounded-xl p-4 shadow-md">
            <h2 className="font-semibold mb-1 text-gray-900">Role</h2>
            <p className="text-sm text-gray-700 capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
