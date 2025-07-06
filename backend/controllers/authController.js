const { dbGet, dbRun } = require('../db');

exports.register = async (req, res) => {
  const { name, email, password, type, phone } = req.body;
  
  try {
    // Check if user exists
    const existingUser = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Insert new user
    const result = await dbRun(
      'INSERT INTO users (name, email, password, type, phone) VALUES (?, ?, ?, ?, ?)',
      [name, email, password, type, phone]
    );
    
    const newUser = await dbGet('SELECT * FROM users WHERE id = ?', [result.lastID]);
    
    res.status(201).json({ 
      id: newUser.id, 
      name: newUser.name, 
      email: newUser.email, 
      type: newUser.type,
      phone:newUser.phone 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await dbGet(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      type: user.type 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};