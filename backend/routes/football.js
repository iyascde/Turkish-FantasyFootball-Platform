const express = require('express');
const router = express.Router();
require('dotenv').config();

const API_KEY = process.env.FOOTBALL_API_KEY;
const BASE_URL = 'https://v3.football.api-sports.io';

const headers = {
  'x-apisports-key': API_KEY
};

// Get Süper Lig standings
router.get('/standings', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/standings?league=203&season=2024`, { headers });
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch standings' });
  }
});

// Get Süper Lig fixtures
router.get('/fixtures', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/fixtures?league=203&season=2024`, { headers });
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
});

// Get top scorers
router.get('/topscorers', async (req, res) => {
  try {
    const response = await fetch(`${BASE_URL}/players/topscorers?league=203&season=2024`, { headers });
    const data = await response.json();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Failed to fetch top scorers' });
  }
});

module.exports = router;