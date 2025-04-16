import { useState, useEffect } from 'react';

export default function UserTable() {
  // API base URL configuration
  const API_BASE_URL = 'https://api.example.com/v1'; // Change this to your actual API URL
  
  // State for users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for modal and form
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalMode, setModalMode] = useState('add'); // 'add', 'edit', or 'view'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    deviceType: '',
    coordinates: '',
    status: 'Active',
    hasAlerts: false
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError('Data is Unavailable at the moment. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Open modal for adding new user
  const handleAddUser = () => {
    setFormData({
      name: '',
      deviceType: '',
      coordinates: '',
      status: 'Active',
      hasAlerts: false
    });
    setModalMode('add');
    setShowModal(true);
  };

  // Open modal for viewing user details
  const handleViewUser = (user) => {
    setCurrentUser(user);
    setModalMode('view');
    setShowModal(true);
  };

  // Open modal for editing user
  const handleEditUser = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      deviceType: user.deviceType,
      coordinates: user.coordinates,
      status: user.status,
      hasAlerts: user.hasAlerts
    });
    setModalMode('edit');
    setShowModal(true);
  };

  // Open delete confirmation
  const handleDeletePrompt = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Create a new user
  const createUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Add authentication if required
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const newUser = await response.json();
      setUsers([...users, newUser]);
      return true;
    } catch (err) {
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
      return false;
    }
  };

  // Update an existing user
  const updateUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Add authentication if required
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUsers(users.map(user => 
        user.id === currentUser.id ? updatedUser : user
      ));
      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
      return false;
    }
  };

  // Delete a user
  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer YOUR_AUTH_TOKEN' // Add authentication if required
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setUsers(users.filter(user => user.id !== userId));
      return true;
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
      return false;
    }
  };

  // Confirm delete user
  const confirmDelete = async () => {
    if (userToDelete) {
      const success = await deleteUser(userToDelete.id);
      if (success) {
        setShowDeleteConfirm(false);
        setUserToDelete(null);
      }
    }
  };

  // Save user (create or update)
  const handleSaveUser = async () => {
    let success;
    
    if (modalMode === 'add') {
      success = await createUser();
    } else if (modalMode === 'edit' && currentUser) {
      success = await updateUser();
    }
    
    if (success) {
      setShowModal(false);
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const bgColor = status === "Active" ? "bg-green-500" : "bg-red-500";
    return (
      <span className={`px-2 py-1 text-xs font-medium text-white rounded-full ${bgColor}`}>
        {status}
      </span>
    );
  };

  // Alert badge component
  const AlertBadge = ({ hasAlerts }) => {
    return hasAlerts ? (
      <span className="px-2 py-1 text-xs font-medium text-white bg-yellow-500 rounded-full">
        Yes
      </span>
    ) : (
      <span className="px-2 py-1 text-xs font-medium text-white bg-gray-400 rounded-full">
        No
      </span>
    );
  };

  // Modal component
  const Modal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {modalMode === 'add' ? 'Add New User' : 
               modalMode === 'edit' ? 'Edit User' : 'User Details'}
            </h2>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          {modalMode === 'view' && currentUser ? (
            <div className="space-y-3">
              <p><strong>ID:</strong> {currentUser.id}</p>
              <p><strong>Name:</strong> {currentUser.name}</p>
              <p><strong>Device Type:</strong> {currentUser.deviceType}</p>
              <p><strong>Coordinates:</strong> {currentUser.coordinates}</p>
              <p><strong>Status:</strong> {currentUser.status}</p>
              <p><strong>Last Updated:</strong> {currentUser.lastUpdated}</p>
              <p><strong>Has Alerts:</strong> {currentUser.hasAlerts ? 'Yes' : 'No'}</p>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Device Type</label>
                <input
                  type="text"
                  name="deviceType"
                  value={formData.deviceType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                <input
                  type="text"
                  name="coordinates"
                  value={formData.coordinates}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="hasAlerts"
                  name="hasAlerts"
                  checked={formData.hasAlerts}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="hasAlerts" className="ml-2 block text-sm text-gray-700">
                  Has Alerts
                </label>
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
                  onClick={handleSaveUser}
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

  // Delete confirmation modal
  const DeleteConfirmation = () => {
    if (!showDeleteConfirm) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p className="mb-6">
            Are you sure you want to delete {userToDelete?.name}? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Show loading or error states
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg flex justify-center">
        <p className="text-lg">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          USER RECORDS MANAGEMENT
        </h1>
        <button 
          className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition-colors"
          onClick={handleAddUser}
        >
          Add New User
        </button>
      </div>
      
      {users.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found. Add a new user to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">ID</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Name</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Type of device</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Coordinates</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Status</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Last updated</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Alerts</th>
                <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b text-sm">{user.id}</td>
                  <td className="py-3 px-4 border-b text-sm font-medium">{user.name}</td>
                  <td className="py-3 px-4 border-b text-sm">{user.deviceType}</td>
                  <td className="py-3 px-4 border-b text-sm">{user.coordinates}</td>
                  <td className="py-3 px-4 border-b text-sm">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="py-3 px-4 border-b text-sm">{user.lastUpdated}</td>
                  <td className="py-3 px-4 border-b text-sm">
                    <AlertBadge hasAlerts={user.hasAlerts} />
                  </td>
                  <td className="py-3 px-4 border-b text-sm">
                    <div className="flex space-x-2">
                      <button 
                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        onClick={() => handleViewUser(user)}
                      >
                        View
                      </button>
                      <button 
                        className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
                        onClick={() => handleEditUser(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                        onClick={() => handleDeletePrompt(user)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <Modal />
      <DeleteConfirmation />
    </div>
  );
}
