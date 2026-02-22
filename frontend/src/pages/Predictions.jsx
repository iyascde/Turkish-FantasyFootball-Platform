import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFixtures } from '../api';
import axios from 'axios';

function Predictions() {
  const navigate = useNavigate();
  const [fixtures, setFixtures] = useState([]);
  const [predictions, setPredictions] = useState({});
  const [submitted, setSubmitted] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    // eslint-disable-next-line
    fetchFixtures();
  }, []);

  const fetchFixtures = async () => {
    try {
      const res = await getFixtures();
      const upcoming = res.data.response.filter(
        (f) => f.fixture.status.short === 'FT'
      ).slice(0, 10);
      setFixtures(upcoming);
    } catch {
      console.log('Failed to fetch fixtures');
    }
  };

  const handlePrediction = (fixtureId, team, value) => {
    setPredictions((prev) => ({
      ...prev,
      [fixtureId]: { ...prev[fixtureId], [team]: value }
    }));
  };

  const handleSubmit = async (fixture) => {
    const prediction = predictions[fixture.fixture.id];
    if (!prediction?.home && prediction?.home !== 0) return alert('Please enter home goals');
    if (!prediction?.away && prediction?.away !== 0) return alert('Please enter away goals');
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/predictions/submit',
        {
          fixture_id: fixture.fixture.id,
          predicted_home_goals: parseInt(prediction.home),
          predicted_away_goals: parseInt(prediction.away)
        },
        { headers: { authorization: token } }
      );
      setSubmitted((prev) => ({ ...prev, [fixture.fixture.id]: true }));
    } catch {
      alert('Failed to submit prediction');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: 'white', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Navbar */}
      <nav style={{
        background: 'rgba(10,10,15,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>⚽</span>
          <span style={{ fontWeight: '700', fontSize: '1.1rem', letterSpacing: '-0.3px' }}>Türk Fantezi</span>
        </div>
        <button onClick={() => navigate('/dashboard')} style={{
          background: 'rgba(255,255,255,0.06)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '8px 18px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
          fontSize: '0.9rem'
        }}>
          ← Dashboard
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #e8201a 0%, #9b0f0b 100%)',
        padding: '32px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '4px' }}>Match Predictions</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>Predict scores and earn points on the leaderboard</p>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {fixtures.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>No fixtures available right now.</p>
        ) : (
          <div style={{ display: 'grid', gap: '12px', maxWidth: '800px' }}>
            {fixtures.map((fixture) => (
              <div key={fixture.fixture.id} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '20px 24px',
                borderRadius: '12px'
              }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {new Date(fixture.fixture.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                    <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} style={{ width: '32px', objectFit: 'contain' }} />
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{fixture.teams.home.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number" min="0" max="20" placeholder="0"
                      onChange={(e) => handlePrediction(fixture.fixture.id, 'home', e.target.value)}
                      style={{
                        width: '52px', padding: '10px', textAlign: 'center',
                        borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.06)', color: 'white',
                        fontSize: '1.1rem', fontWeight: '700', outline: 'none'
                      }}
                    />
                    <span style={{ fontWeight: '800', fontSize: '1rem', color: 'rgba(255,255,255,0.3)' }}>—</span>
                    <input
                      type="number" min="0" max="20" placeholder="0"
                      onChange={(e) => handlePrediction(fixture.fixture.id, 'away', e.target.value)}
                      style={{
                        width: '52px', padding: '10px', textAlign: 'center',
                        borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.06)', color: 'white',
                        fontSize: '1.1rem', fontWeight: '700', outline: 'none'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{fixture.teams.away.name}</span>
                    <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} style={{ width: '32px', objectFit: 'contain' }} />
                  </div>
                </div>
                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
                  {submitted[fixture.fixture.id] ? (
                    <span style={{ color: '#4ade80', fontWeight: '700', fontSize: '0.9rem' }}>✓ Prediction submitted</span>
                  ) : (
                    <button onClick={() => handleSubmit(fixture)} style={{
                      background: '#e8201a', color: 'white', border: 'none',
                      padding: '9px 28px', borderRadius: '8px', cursor: 'pointer',
                      fontWeight: '700', fontSize: '0.9rem'
                    }}>
                      Submit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Predictions;