import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AvailableRides from '../components/AvailableRides';
import RideStatus from '../components/RideStatus';
import RideHistory from '../components/RideHistory';

const DriverDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeRide, setActiveRide] = useState(null);
  const [availableRides, setAvailableRides] = useState([]);
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch dashboard data
  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      // 1. Fetch active ride (ignore 404 - means no active ride)
      let activeRideData = null;
      try {
        const activeRes = await axios.get(`http://localhost:5000/api/rides/active/${user.id}`);
        activeRideData = activeRes.data;
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error fetching active ride:', err);
          setError('Failed to fetch active ride: ' + (err.response?.data?.message || err.message));
        }
      }
      setActiveRide(activeRideData);

      // 2. Fetch ride history
      try {
        const historyRes = await axios.get(`http://localhost:5000/api/rides/history/${user.id}`);
        setRideHistory(historyRes.data || []);
      } catch (err) {
        console.error('Error fetching ride history:', err);
        setError('Failed to fetch ride history: ' + (err.response?.data?.message || err.message));
      }

      // 3. Fetch available rides (always fetch regardless of activeRide)
      try {
        const availableRes = await axios.get('http://localhost:5000/api/rides/available');
        setAvailableRides(availableRes.data || []);
      } catch (err) {
        console.error('Error fetching available rides:', err);
        setAvailableRides([]);
        setError('Failed to fetch available rides: ' + (err.response?.data?.message || err.message));
      }

      setLastRefresh(new Date());
    } catch (err) {
      console.error('Unexpected error fetching dashboard:', err);
      setError('Unexpected error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user.id]);

  // Handle accepting a ride
  const handleAcceptRide = async (rideId) => {
    try {
      await axios.patch(`http://localhost:5000/api/rides/${rideId}/accept`, {
        driverId: user.id
      });
      await fetchData(); // refresh dashboard after accept
      setError('');
    } catch (err) {
      console.error('Error accepting ride:', err);
      setError(err.response?.data?.message || 'Failed to accept ride');
    }
  };

  // Handle updating ride status
  const handleUpdateStatus = async (status) => {
    try {
      await axios.patch(`http://localhost:5000/api/rides/${activeRide.id}/status`, {
        status
      });
      await fetchData(); // refresh dashboard after status update
      setError('');
    } catch (err) {
      console.error('Error updating ride status:', err);
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Loading driver dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto p-4">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Driver Dashboard</h1>
      </div>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Active Ride */}
      {activeRide ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Active Ride</h2>
          <RideStatus 
            ride={activeRide} 
            onUpdateStatus={handleUpdateStatus} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">No Active Ride</h2>
          <p>You don't have any active rides at the moment.</p>
        </div>
      )}

      {/* Available Rides */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Available Rides</h2>
          <button 
            onClick={fetchData}
            className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded hover:bg-blue-200"
          >
            Refresh Now
          </button>
        </div>
        <AvailableRides 
          rides={availableRides} 
          onAccept={handleAcceptRide} 
          disabled={!!activeRide}
        />
      </div>

      {/* Ride History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Ride History</h2>
        <RideHistory rides={rideHistory} />
      </div>
    </div>
  );
};

export default DriverDashboard;
