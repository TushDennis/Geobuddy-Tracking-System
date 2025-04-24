import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminImeiSeeding = () => {
  const [imeiNumbers, setImeiNumbers] = useState("");
  const [imeiStatusList, setImeiStatusList] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchImeiStatuses();
  }, []);

  const fetchImeiStatuses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/admin/imei", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setImeiStatusList(response.data);
    } catch (error) {
      console.error("Error fetching IMEI statuses:", error);
      setMessage("Error fetching IMEI statuses.");
    }
  };

  const handleSeedImei = async () => {
    const imeiArray = imeiNumbers
      .split("\n")
      .map((imei) => imei.trim())
      .filter((imei) => imei.length > 0);

    const token = localStorage.getItem("token");

    try {
      for (const imei of imeiArray) {
        try {
          await axios.post(
            "http://localhost:8080/admin/imei",
            { imei },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        } catch (error) {
          console.error(`Failed to post IMEI ${imei}:`, error);
        }
      }

      setMessage("IMEI numbers seeded successfully.");
      setImeiNumbers("");
      fetchImeiStatuses(); // refresh the table
    } catch (error) {
      setMessage("An error occurred while seeding IMEIs.");
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">
        📡 Admin IMEI Seeding
      </h2>

      <textarea
        rows="6"
        className="w-full border border-gray-300 rounded-md p-3 mb-4 text-sm"
        placeholder="Enter IMEI numbers (one per line)"
        value={imeiNumbers}
        onChange={(e) => setImeiNumbers(e.target.value)}
      ></textarea>

      <button
        onClick={handleSeedImei}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition mb-6"
      >
        ➕ Seed IMEI Numbers
      </button>

      {message && (
        <div className="text-center text-sm font-semibold text-green-600 mb-4">
          {message}
        </div>
      )}

      <h3 className="text-xl font-semibold mb-3">📋 IMEI Status List</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">IMEI Number</th>
              <th className="px-4 py-3 text-left">Registered</th>
            </tr>
          </thead>
          <tbody>
            {imeiStatusList.map((imeiStatus) => (
              <tr key={imeiStatus.imei} className="border-t border-gray-200">
                <td className="px-4 py-2 font-mono">{imeiStatus.imei}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      imeiStatus.registered
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {imeiStatus.registered ? "Yes" : "No"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminImeiSeeding;
