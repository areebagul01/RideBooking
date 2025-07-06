const RideStatus = ({ ride, onUpdateStatus }) => {
  const statuses = ['Requested', 'Accepted', 'In Progress', 'Completed'];
  const currentStatusIndex = statuses.indexOf(ride.status);

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Current Ride Status</h2>
      
      <div className="flex justify-between mb-6">
        {statuses.map((status, index) => (
          <div key={status} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center 
                ${index <= currentStatusIndex ? 'bg-yellow-500' : 'bg-gray-300'} text-white`}
            >
              {index + 1}
            </div>
            <span className="mt-2 text-sm">{status}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold">Pickup Location</h3>
          <p>{ride.pickup_location}</p>
        </div>
        <div>
          <h3 className="font-semibold">Drop-off Location</h3>
          <p>{ride.drop_location}</p>
        </div>
        <div>
          <h3 className="font-semibold">Ride Type</h3>
          <p>{ride.ride_type}</p>
        </div>
        <div>
          <h3 className="font-semibold">Fare Amount</h3>
          <p>Rs.{ride.fare ? ride.fare.toFixed(2) : '0.00'}</p>
        </div>
        <div>
          <h3 className="font-semibold">Driver</h3>
          <p>{ride.driver_name || 'Awaiting driver...'}</p>
        </div>
      </div>
      
      {onUpdateStatus && (
        <div className="mt-4 flex space-x-2">
          {ride.status === 'Accepted' && (
            <button 
              onClick={() => onUpdateStatus('In Progress')}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Start Ride
            </button>
          )}
          {ride.status === 'In Progress' && (
            <button 
              onClick={() => onUpdateStatus('Completed')}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              Complete Ride
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RideStatus;