const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const DB_PATH = path.join(__dirname, 'ride_booking.db');

// Create database connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database');
    initDb();
  }
});

// Initialize database
function initDb() {
  db.serialize(() => {
    db.run(`DROP TABLE users`);
    db.run(`DROP TABLE rides`);

    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      type TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create rides table
    db.run(`CREATE TABLE IF NOT EXISTS rides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      passenger_id INTEGER NOT NULL,
      driver_id INTEGER,
      pickup_location TEXT NOT NULL,
      drop_location TEXT NOT NULL,
      ride_type TEXT NOT NULL,
      fare REAL,
      status TEXT NOT NULL DEFAULT 'Requested',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (passenger_id) REFERENCES users(id),
      FOREIGN KEY (driver_id) REFERENCES users(id)
    )`);

    // Sample Data of users table
    db.run(`INSERT OR IGNORE INTO users (name, email, password, type, phone) 
            VALUES ('Ayesha', 'ayesha@gmail.com', 'pass123', 'passenger', '0311-1234567')`);

    db.run(`INSERT OR IGNORE INTO users (name, email, password, type, phone) 
            VALUES ('Ali', 'ali@gmail.com', 'pass123', 'passenger', '0322-1234567')`);
    
    db.run(`INSERT OR IGNORE INTO users (name, email, password, type, phone) 
            VALUES ('Umer', 'umer@gmail.com', 'pass123', 'driver', '0333-1234567')`);
    
    db.run(`INSERT OR IGNORE INTO users (name, email, password, type, phone) 
            VALUES ('Ahmad', 'ahmad@gmail.com', 'pass123', 'driver', '0344-1234567')`);
    
    // Sample Data of rides table
    db.run(`INSERT OR IGNORE INTO rides (passenger_id, pickup_location, drop_location, ride_type, fare, status)
            VALUES (1, 'DHA', 'Johar Town', 'Car', '600', 'Requested')`);
    
    db.run(`INSERT OR IGNORE INTO rides (passenger_id, pickup_location, drop_location, ride_type, fare, status)
            VALUES (2, 'Lake City', 'Model Town', 'Bike', '400', 'Requested')`);
    
    db.run(`INSERT OR IGNORE INTO rides (passenger_id, driver_id, pickup_location, drop_location, ride_type, fare, status)
            VALUES (1, 3, 'Ghazi Road', 'Airport', 'Rickshaw', '450', 'Accepted')`);
  });
}

// Helper functions
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = { db, dbRun, dbGet, dbAll };