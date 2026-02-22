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
      // Only show upcoming fixtures
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
      [fixtureId]: {
        ...prev[fixtureId],
        [team]: value
      }
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
    <div style={{ minHeight: '100vh', background: '#1a1a2e', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#e8201a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem' }}>⚽ Türk Fantezi Futbol</h1>
        <button onClick={() => navigate('/dashboard')} style={{ background: 'white', color: '#e8201a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Back to Dashboard
        </button>
      </div>

      <div style={{ padding: '32px' }}>
        <h2 style={{ marginBottom: '24px' }}>Match Predictions</h2>
        <p style={{ color: '#aaa', marginBottom: '24px' }}>Predict the score for upcoming Süper Lig matches and earn points!</p>

        <div style={{ display: 'grid', gap: '16px' }}>
          {fixtures.length === 0 && (
            <p style={{ color: '#aaa' }}>No upcoming fixtures available right now.</p>
          )}
          {fixtures.map((fixture) => (
            <div key={fixture.fixture.id} style={{ background: '#2a2a4e', padding: '20px', borderRadius: '10px' }}>
              <p style={{ color: '#aaa', fontSize: '0.85rem', marginBottom: '12px' }}>
                {new Date(fixture.fixture.date).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} style={{ width: '36px' }} />
                  <span style={{ fontWeight: 'bold' }}>{fixture.teams.home.name}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    placeholder="0"
                    onChange={(e) => handlePrediction(fixture.fixture.id, 'home', e.target.value)}
                    style={{ width: '50px', padding: '8px', textAlign: 'center', borderRadius: '6px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}
                  />
                  <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>-</span>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    placeholder="0"
                    onChange={(e) => handlePrediction(fixture.fixture.id, 'away', e.target.value)}
                    style={{ width: '50px', padding: '8px', textAlign: 'center', borderRadius: '6px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'flex-end' }}>
                  <span style={{ fontWeight: 'bold' }}>{fixture.teams.away.name}</span>
                  <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} style={{ width: '36px' }} />
                </div>
              </div>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                {submitted[fixture.fixture.id] ? (
                  <span style={{ color: '#4caf50', fontWeight: 'bold' }}>✓ Prediction Submitted!</span>
                ) : (
                  <button
                    onClick={() => handleSubmit(fixture)}
                    style={{ background: '#e8201a', color: 'white', border: 'none', padding: '8px 24px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Submit Prediction
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Predictions;