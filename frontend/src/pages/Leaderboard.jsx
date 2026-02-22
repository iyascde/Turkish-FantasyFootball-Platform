import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    // eslint-disable-next-line
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/predictions/leaderboard');
      setLeaderboard(res.data);
    } catch {
      console.log('Failed to fetch leaderboard');
    }
  };

  const getMedal = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
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
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '4px' }}>Leaderboard</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>Top prediction scores this season</p>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: '700px', margin: '0 auto' }}>
        {leaderboard.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏆</div>
            <p style={{ fontSize: '1rem', fontWeight: '600' }}>No predictions yet</p>
            <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Be the first to predict!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '8px' }}>
            {leaderboard.map((entry, index) => (
              <div key={entry.username} style={{
                background: index === 0 ? 'rgba(255,215,0,0.06)' : 'rgba(255,255,255,0.03)',
                border: index === 0 ? '1px solid rgba(255,215,0,0.2)' : '1px solid rgba(255,255,255,0.06)',
                padding: '16px 24px',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '1.4rem', minWidth: '36px' }}>{getMedal(index)}</span>
                  <span style={{ fontWeight: '700', fontSize: '1rem' }}>{entry.username}</span>
                </div>
                <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#e8201a' }}>
                  {entry.total_points || 0} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;