import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/profile/${user.id}`);
        setName(response.data.name);
        setPhone(response.data.phone || '');
        setLoading(false);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const response = await axios.patch(
        `http://localhost:5000/api/users/profile/${user.id}`,
        { name, phone }
      );
      
      // Update context with new profile data
      updateUser({ 
        name: response.data.name, 
        phone: response.data.phone 
      });
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your phone number"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-medium">User Type</label>
          <input
            type="text"
            value={user.type}
            disabled
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;