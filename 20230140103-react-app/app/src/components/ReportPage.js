import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";          // <-- pastikan ini ada
import "../App.css";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: query ? { nama: query } : {},   // kirim filter nama kalau ada
      };

      setError(null);

      const res = await axios.get(
        "http://localhost:3001/api/reports/daily",
        config
      );

      // backend lo return: { reportDate, data: [...] }
      setReports(res.data.data || []);
    } catch (err) {
      console.error(err.response || err.message);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil laporan"
      );
    }
  };

  useEffect(() => {
    fetchReports("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // cukup sekali saat mount

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  return (
    <div className="app">
      <div className="w-full max-w-5xl mx-auto bg-white/20 rounded-2xl p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Laporan Presensi Harian
        </h1>

        <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-2">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700"
          >
            Cari
          </button>
        </form>

        {error && (
          <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">
            {error}
          </p>
        )}

        {!error && (
          <div className="bg-white shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-In
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Check-Out
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Latitude</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Longitude</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.length > 0 ? (
                  reports.map((presensi) => (
                    <tr key={presensi.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {/* backend kirim field "nama", bukan "user.nama" */}
                        {presensi.nama || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {presensi.checkIn
                          ? new Date(presensi.checkIn).toLocaleString(
                              "id-ID",
                              { timeZone: "Asia/Jakarta" }
                            )
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {presensi.checkOut
                          ? new Date(presensi.checkOut).toLocaleString(
                              "id-ID",
                              { timeZone: "Asia/Jakarta" }
                            )
                          : "Belum Check-Out"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {presensi.latitude ?? "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {presensi.longitude ?? "-"}
                        </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Tidak ada data yang ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
