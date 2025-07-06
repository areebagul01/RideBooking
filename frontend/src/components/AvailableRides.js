const AvailableRides = ({ rides, onAccept, disabled }) => {
  if (rides.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">No Rides Available</h3>
        <p className="text-gray-600">
          {disabled 
            ? "Complete your current ride to see new requests" 
            : "New ride requests will appear here automatically"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rides.map((ride) => (
          <div 
            key={ride.id} 
            className={`border rounded-lg p-4 transition ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            <div className="mb-2">
              <span className="font-semibold">Passenger:</span> {ride.passenger_name}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Pickup:</span> {ride.pickup_location}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Drop-off:</span> {ride.drop_location}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Type:</span> {ride.ride_type}
            </div>
            <div className="mb-3">
                <div className="font-semibold text-sm text-gray-600">Fare:</div>
                <div className="font-medium">Rs.{ride.fare ? ride.fare.toFixed(2) : '0.00'}</div>
            </div>
            <div className="mb-2 text-sm text-gray-500">
              Requested: {new Date(ride.created_at).toLocaleTimeString()}
            </div>
            <button
              onClick={() => !disabled && onAccept(ride.id)}
              disabled={disabled}
              className={`w-full py-2 rounded transition ${
                disabled 
                  ? 'bg-gray-300 text-gray-500' 
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              {disabled ? 'Accept (disabled)' : 'Accept Ride'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableRides;