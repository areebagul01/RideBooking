import { useState } from 'react';

const RideRequest = ({ onRequest }) => {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [rideType, setRideType] = useState('Bike');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRequest(pickup, dropoff, rideType);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Request a Ride</h2>
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
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Request Ride
        </button>
      </form>
    </div>
  );
};

export default RideRequest;