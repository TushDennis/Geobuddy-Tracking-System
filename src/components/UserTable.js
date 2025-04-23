import { useState, useEffect } from "react";

export default function AdminPanel() {
  const API_BASE_URL = "http://localhost:8080";

  // States
  const [users, setUsers] = useState([]);
  const [trackers, setTrackers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState("add");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError("Data is Unavailable at the moment. Please try again later.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrackers = async (type) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/admin/all-trackers`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      setTrackers(data);
      setError(null);
    } catch (err) {
      setError("Error fetching trackers.");
      console.error("Error fetching trackers:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      setUsers(users.filter((user) => user.id !== userId));
      return true;
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
      return false;
    }
  };

  const deleteTracker = async (trackerId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/trackers/${trackerId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      setTrackers(trackers.filter((tracker) => tracker.id !== trackerId));
      return true;
    } catch (err) {
      console.error("Error deleting tracker:", err);
      setError("Failed to delete tracker. Please try again.");
      return false;
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/users/${currentUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(currentUser),
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const updatedUser = await response.json();
      setUsers(
        users.map((user) => (user.id === currentUser.id ? updatedUser : user))
      );
      return true;
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
      return false;
    }
  };

  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {modalMode === "add"
                ? "Add New User"
                : modalMode === "edit"
                ? "Edit User"
                : "User Details"}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {modalMode === "edit" && currentUser && (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentUser.name}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={updateUser}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchUsers();
    fetchTrackers("all");
  }, []);

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUser(userId);
    }
  };

  const handleDeleteTracker = (trackerId) => {
    if (window.confirm("Are you sure you want to delete this tracker?")) {
      deleteTracker(trackerId);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4 text-blue-500 font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-3 rounded mb-4 border border-red-200">
          {error}
        </div>
      )}

      <h2 className="text-xl font-semibold mt-6 mb-2">Users</h2>
      <ul className="space-y-2 text-black">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-gray-100 p-4 rounded flex flex-col justify-between items-start"
          >
            {Object.entries(user).map(([key, value]) => (
              <div key={key} className="mb-2">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                <span>{value}</span>
              </div>
            ))}
            <div className="space-x-2">
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setCurrentUser(user);
                  setModalMode("edit");
                  setShowModal(true);
                }}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">Trackers</h2>
      <ul className="space-y-2 text-black">
        {trackers.map((tracker) => (
          <li
            key={tracker.id}
            className="bg-gray-100 p-4 rounded flex flex-col justify-between items-start"
          >
            {Object.entries(tracker).map(([key, value]) => (
              <div key={key} className="mb-2">
                <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>
                <span>{value}</span>
              </div>
            ))}
            <button
              onClick={() => handleDeleteTracker(tracker.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <Modal />
    </div>
  );
}
