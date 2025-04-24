import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:8080";

const Modal = ({ visible, title, children, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ListItem = ({ data, onDelete, onEdit }) => (
  <li className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition">
    {Object.entries(data).map(([key, value]) => (
      <div key={key} className="text-sm text-slate-600">
        <strong className="text-slate-800">{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
        {value}
      </div>
    ))}
    <div className="mt-3 flex gap-2">
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex-1 px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
        >
          Edit
        </button>
      )}
      <button
        onClick={onDelete}
        className="flex-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
      >
        Delete
      </button>
    </div>
  </li>
);

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [trackers, setTrackers] = useState([]);
  const [trackerType, setTrackerType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackers = async (type = "all") => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/admin/all-trackers?type=${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch trackers");
      const data = await res.json();
      setTrackers(data);
    } catch (err) {
      setError("Failed to load trackers.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await fetch(`${API_BASE_URL}/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  const handleDeleteTracker = async (id) => {
    if (!window.confirm("Delete this tracker?")) return;
    try {
      await fetch(`${API_BASE_URL}/user/trackers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrackers(trackers.filter((t) => t.id !== id));
    } catch (err) {
      alert("Error deleting tracker.");
    }
  };

  const handleUpdateUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${currentUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentUser),
      });
      const updated = await res.json();
      setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
      setModalVisible(false);
    } catch {
      alert("Update failed.");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTrackers(trackerType); // initial load
  }, []);

  useEffect(() => {
    fetchTrackers(trackerType); // filter effect
  }, [trackerType]);

  if (loading) return <p className="text-center text-blue-500">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold text-slate-800 mb-10 text-center">Admin Dashboard</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* USERS SECTION */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-slate-700">Users</h2>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <ListItem
              key={user.id}
              data={user}
              onDelete={() => handleDeleteUser(user.id)}
              onEdit={() => {
                setCurrentUser(user);
                setModalVisible(true);
              }}
            />
          ))}
        </ul>
      </section>

      {/* TRACKERS SECTION */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-slate-700">Trackers</h2>
          <select
            value={trackerType}
            onChange={(e) => setTrackerType(e.target.value)}
            className="border border-gray-300 text-sm rounded px-3 py-2 shadow-sm"
          >
            <option value="all">All</option>
            <option value="pet">Pet</option>
            <option value="child">Child</option>
            <option value="luggage">Luggage</option>
          </select>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trackers.map((tracker) => (
            <ListItem
              key={tracker.id}
              data={tracker}
              onDelete={() => handleDeleteTracker(tracker.id)}
            />
          ))}
        </ul>
      </section>

      <Modal
        visible={modalVisible}
        title="Edit User"
        onClose={() => setModalVisible(false)}
      >
        {currentUser && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateUser();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block mb-1 font-medium">Name</label>
              <input
                className="w-full border px-3 py-2 rounded"
                type="text"
                value={currentUser.name}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, name: e.target.value })
                }
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalVisible(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
