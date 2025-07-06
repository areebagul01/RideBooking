const { dbGet, dbRun } = require('../db');

exports.getUserProfile = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const user = await dbGet(
      'SELECT id, name, email, type, phone FROM users WHERE id = ?',
      [userId]
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      type: user.type,
      phone: user.phone || ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.params.userId;
  const { name, phone } = req.body;
  
  try {
    const result = await dbRun(
      'UPDATE users SET name = ?, phone = ? WHERE id = ?',
      [name, phone, userId]
    );
    
    if (result.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const updatedUser = await dbGet(
      'SELECT id, name, email, type, phone FROM users WHERE id = ?',
      [userId]
    );
    
    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      type: updatedUser.type,
      phone: updatedUser.phone || ''
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};