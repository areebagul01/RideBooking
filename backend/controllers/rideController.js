const { dbRun, dbGet, dbAll } = require('../db');

exports.createRide = async (req, res) => {
  const { passengerId, pickupLocation, dropLocation, rideType, fare } = req.body;
  
  try {
    // Check for active ride
    const activeRide = await dbGet(
      `SELECT * FROM rides 
       WHERE passenger_id = ? 
       AND status IN ('Requested', 'Accepted', 'In Progress')`,
      [passengerId]
    );
    
    if (activeRide) {
      return res.status(400).json({ 
        message: 'You already have an active ride. Please complete it before booking a new one.' 
      });
    }
    
    // Insert new ride
   const result = await dbRun(
      `INSERT INTO rides 
       (passenger_id, pickup_location, drop_location, ride_type, fare, status) 
       VALUES (?, ?, ?, ?, ?, 'Requested')`,
      [passengerId, pickupLocation, dropLocation, rideType, fare]
    );
    
    res.status(201).json({ rideId: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getActiveRide = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const ride = await dbGet(
      `SELECT 
        rides.*, 
        driver.name AS driver_name
      FROM rides
      LEFT JOIN users AS driver ON rides.driver_id = driver.id
      WHERE (rides.passenger_id = ? OR rides.driver_id = ?) 
        AND rides.status IN ('Requested', 'Accepted', 'In Progress') 
      LIMIT 1`,
      [userId, userId]
    );
    
    if (!ride) {
      return res.status(404).json({ message: 'No active ride found' });
    }
    
    res.json(ride);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRideHistory = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const rides = await dbAll(
      `SELECT 
        rides.*, 
        driver.name AS driver_name
      FROM rides
      LEFT JOIN users AS driver ON rides.driver_id = driver.id
      WHERE rides.passenger_id = ? OR rides.driver_id = ? 
      ORDER BY rides.created_at DESC`,
      [userId, userId]
    );
    
    res.json(rides);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAvailableRides = async (req, res) => {
  try {
    // Log all requested rides to confirm they're in the database
    const requestedRides = await dbAll(
      `SELECT * FROM rides WHERE status = 'Requested'`
    );

    // Your actual available rides query
    const rides = await dbAll(
      `SELECT 
        rides.id, 
        rides.pickup_location, 
        rides.drop_location, 
        rides.ride_type, 
        rides.fare,
        rides.created_at,
        users.name AS passenger_name
      FROM rides
      JOIN users ON rides.passenger_id = users.id
      WHERE rides.status = 'Requested' 
        AND rides.driver_id IS NULL
      ORDER BY rides.created_at DESC`
    );

    res.json(rides);
  } catch (err) {
    console.error('Error fetching available rides:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.acceptRide = async (req, res) => {
  const rideId = req.params.rideId;
  const { driverId } = req.body;
  
  try {
    // Check if driver has active ride
    const activeDriverRide = await dbGet(
      `SELECT * FROM rides 
       WHERE driver_id = ? 
       AND status IN ('Accepted', 'In Progress')`,
      [driverId]
    );
    
    if (activeDriverRide) {
      return res.status(400).json({ message: 'You already have an active ride' });
    }
    
    // Accept ride
    const result = await dbRun(
      `UPDATE rides 
       SET driver_id = ?, status = 'Accepted' 
       WHERE id = ? AND status = 'Requested'`,
      [driverId, rideId]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Ride not available' });
    }
    
    res.json({ message: 'Ride accepted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRideStatus = async (req, res) => {
  const rideId = req.params.rideId;
  const { status } = req.body;
  
  try {
    const validStatus = ['Accepted', 'In Progress', 'Completed'];
    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const result = await dbRun(
      'UPDATE rides SET status = ? WHERE id = ?',
      [status, rideId]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    
    res.json({ message: 'Ride status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};