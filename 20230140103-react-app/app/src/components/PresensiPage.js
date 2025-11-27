import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

function AttendancePage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null); // { lat, lng }
  const navigate = useNavigate();

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // ====== Ambil lokasi user ======
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          console.error(err);
          setError("Gagal mendapatkan lokasi: " + err.message);
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  };

  // ambil lokasi saat komponen pertama kali dimuat
  useEffect(() => {
    getLocation();
  }, []);

  // ====== Check-In kirim lokasi ======
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum didapatkan. Mohon izinkan akses lokasi.");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        config
      );

      setMessage(response.data.message || "Check-in berhasil.");
    } catch (err) {
      console.error(err.response || err.message);
      setError(
        err.response ? err.response.data.message : "Check-in gagal"
      );
    }
  };

  // ====== Check-Out (tanpa lokasi, sesuai kode awal lo) ======
  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      };

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        config
      );

      setMessage(response.data.message);
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Check-out gagal"
      );
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Lakukan Presensi
        </h2>

        {/* Map lokasi user */}
        {coords && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-md">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={16}
              style={{ height: "280px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>Lokasi Anda saat ini</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {message && <p className="text-green-600 mb-4">{message}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex space-x-4">
          <button
            onClick={handleCheckIn}
            className="w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700"
          >
            Check-In
          </button>

          <button
            onClick={handleCheckOut}
            className="w-full py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
          >
            Check-Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
