import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from "react-router-dom";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import DashboardPage from "./components/DashboardPage";
import PresensiPage from "./components/PresensiPage";
import ReportPage from "./components/ReportPage";
import AttendancePage from "./components/PresensiPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="top-nav">
      {/* kiri */}
      {token ? (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/attendance">Presensi</Link>
          <Link to="/reports">Laporan</Link>
        </>        
      ) : (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}

      {/* kanan */}
      {token && (
        <button
          onClick={handleLogout}
          className="ml-auto px-3 py-1 rounded-md bg-red-500 text-white font-semibold"
        >
          Logout
        </button>
      )}
    </nav>
  );
}

export default App;
