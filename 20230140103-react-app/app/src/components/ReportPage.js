import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null); // buat popout
  const navigate = useNavigate();

  const fetchReports = async (query) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:3001/api/reports/daily",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: query ? { nama: query } : {},
        }
      );

      setReports(res.data.data || []);
      setError(null);
    } catch (err) {
      console.error(err.response || err.message);
      setError(
        err.response ? err.response.data.message : "Gagal mengambil laporan"
      );
    }
  };

  useEffect(() => {
    fetchReports("");
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm);
  };

  const baseUrl = "http://localhost:3001"; // buat bangun URL gambar

  return (
    <div className="app">
      <div className="w-full max-w-5xl mx-auto bg-white/20 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Laporan Presensi Harian
        </h1>

        <form onSubmit={handleSearchSubmit} className="mb-6 flex space-x-3">
          <input
            type="text"
            placeholder="Cari berdasarkan nama..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md bg-white/10 border border-white/40 text-white placeholder-white/50 focus:outline-none"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-400 text-gray-900 font-semibold rounded-md shadow hover:bg-emerald-300"
          >
            Cari
          </button>
        </form>

        {error && (
          <p className="text-red-600 bg-red-100 p-4 rounded-md mb-4">{error}</p>
        )}

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">
                  Nama
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">
                  Check-In
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">
                  Check-Out
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">
                  Latitude
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">
                  Longitude
                </th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">
                  Foto
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 bg-white">
              {reports.length > 0 ? (
                reports.map((presensi, i) => (
                  <tr key={presensi.id || i}>
                    <td className="px-6 py-4">{presensi.nama}</td>

                    <td className="px-6 py-4">
                      {presensi.checkIn
                        ? new Date(presensi.checkIn).toLocaleString("id-ID")
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      {presensi.checkOut
                        ? new Date(presensi.checkOut).toLocaleString("id-ID")
                        : "Belum Check-Out"}
                    </td>

                    <td className="px-6 py-4">
                      {presensi.latitude ?? "-"}
                    </td>
                    <td className="px-6 py-4">
                      {presensi.longitude ?? "-"}
                    </td>

                    <td className="px-6 py-4">
                      {presensi.buktiFoto ? (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedImage(`${baseUrl}/${presensi.buktiFoto}`)
                          }
                          className="focus:outline-none"
                        >
                          <img
                            src={`${baseUrl}/${presensi.buktiFoto}`}
                            alt="Bukti presensi"
                            className="h-12 w-12 object-cover rounded-md border hover:scale-105 transition-transform"
                          />
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">
                          Tidak ada foto
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Tidak ada data yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* POPUP PREVIEW FOTO */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white rounded-xl p-4 max-w-lg w-[90%] shadow-2xl"
              onClick={(e) => e.stopPropagation()} // biar klik gambar gak nutup
            >
              <img
                src={selectedImage}
                alt="Preview bukti presensi"
                className="w-full h-auto rounded-lg mb-4"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="w-full py-2 rounded-md bg-gray-800 text-white font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportPage;
