import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import RideStatus from '../components/RideStatus';
import RideHistory from '../components/RideHistory';

const PassengerDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeRide, setActiveRide] = useState(null);
  const [rideHistory, setRideHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      try {
        // Fetch active ride (ignore 404 errors)
        try {
          const activeRes = await axios.get(`http://localhost:5000/api/rides/active/${user.id}`);
          setActiveRide(activeRes.data);
        } catch (activeErr) {
          if (activeErr.response?.status !== 404) {
            throw activeErr;
          }
        }
        
        // Fetch ride history
        const historyRes = await axios.get(`http://localhost:5000/api/rides/history/${user.id}`);
        console.log('History response:', historyRes.data);
        setRideHistory(historyRes.data);
      } catch (err) {
        if (err.response?.status !== 404) {
          setError('Failed to fetch rides: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [user]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className="text-2xl font-bold mb-6">Passenger Dashboard</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {!activeRide ? (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">No Active Ride</h2>
          <p className="mb-4">You don't have any active rides at the moment.</p>
          <button
            onClick={() => navigate('/book-ride')}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition"
          >
            Book a New Ride
          </button>
        </div>
      ) : (
        <RideStatus ride={activeRide} />
      )}
      
      <RideHistory rides={rideHistory} />
    </div>
  );
};

export default PassengerDashboard;