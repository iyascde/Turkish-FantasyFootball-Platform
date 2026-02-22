const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Submit a prediction
router.post('/submit', verifyToken, async (req, res) => {
  const { fixture_id, predicted_home_goals, predicted_away_goals } = req.body;
  try {
    // Check if prediction already exists
    const existing = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 AND fixture_id = $2',
      [req.user.id, fixture_id]
    );
    if (existing.rows.length > 0) {
      // Update existing prediction
      const result = await pool.query(
        'UPDATE predictions SET predicted_home_goals = $1, predicted_away_goals = $2 WHERE user_id = $3 AND fixture_id = $4 RETURNING *',
        [predicted_home_goals, predicted_away_goals, req.user.id, fixture_id]
      );
      return res.json({ message: 'Prediction updated!', prediction: result.rows[0] });
    }
    // Create new prediction
    const result = await pool.query(
      'INSERT INTO predictions (user_id, fixture_id, predicted_home_goals, predicted_away_goals) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, fixture_id, predicted_home_goals, predicted_away_goals]
    );
    res.json({ message: 'Prediction submitted!', prediction: result.rows[0] });
  } catch {
    res.status(500).json({ error: 'Failed to submit prediction' });
  }
});

// Get user's predictions
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM predictions WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch predictions' });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT users.username, SUM(predictions.points_earned) as total_points 
       FROM predictions 
       JOIN users ON predictions.user_id = users.id 
       GROUP BY users.username 
       ORDER BY total_points DESC`
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

module.exports = router;