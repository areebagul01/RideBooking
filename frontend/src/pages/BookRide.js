import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const BookRide = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideType, setRideType] = useState('Bike');
  const [fare, setFare] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/rides', {
        passengerId: user.id,
        pickupLocation: pickup,
        dropLocation: dropoff,
        rideType,
        fare,
      });

      setSuccess('Ride booked successfully! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book ride');
    }
  };

  return (
    <>
    <div
        className="w-full min-h-[calc(100vh-64px)] flex items-center bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("/background.jpg")',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Left: Promotional Text */}
        <div className="hidden md:flex w-1/2 z-10 justify-center items-center p-10">
          <div className="text-white text-left space-y-4 drop-shadow-md">
            <h2 className="text-5xl font-bold">Plan Your Perfect Ride</h2>
            <p className="text-lg">
              From quick errands to long trips, our ride booking makes travel stress-free and simple.
            </p>
            <p className="text-sm italic">
              Schedule your journey and enjoy comfort, safety, and speed — all in one ride.
            </p>
          </div>
        </div>

        {/* Right: Book Ride Form */}
        <div className="w-full md:w-1/2 z-10 flex justify-center items-center">
          <div className="bg-white/80 backdrop-blur-md rounded-lg shadow-md max-w-md w-full p-6 m-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Book a Ride</h2>

            {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
            {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Pickup Location</label>
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter pickup location"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Drop-off Location</label>
                <input
                  type="text"
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter drop-off location"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Ride Type</label>
                <select
                  value={rideType}
                  onChange={(e) => setRideType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="Bike">Bike</option>
                  <option value="Car">Car</option>
                  <option value="Rickshaw">Rickshaw</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Fare Amount</label>
                <input
                  type="number"
                  value={fare}
                  onChange={(e) => setFare(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter fare amount"
                  min="1"
                  step="0.5"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
              >
                Book Ride Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookRide;
