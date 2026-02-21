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
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create a league
router.post('/create', verifyToken, async (req, res) => {
  const { name, type } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO leagues (name, type, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, type, req.user.id]
    );
    const league = result.rows[0];
    // Auto join the creator
    await pool.query(
      'INSERT INTO league_members (league_id, user_id) VALUES ($1, $2)',
      [league.id, req.user.id]
    );
    res.json({ message: 'League created!', league });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create league' });
  }
});

// Get all leagues
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leagues');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
});

// Join a league
router.post('/join/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query(
      'INSERT INTO league_members (league_id, user_id) VALUES ($1, $2)',
      [id, req.user.id]
    );
    res.json({ message: 'Joined league!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to join league' });
  }
});

module.exports = router;