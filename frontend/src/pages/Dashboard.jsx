import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newLeague, setNewLeague] = useState({ name: '', type: 'fantasy' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    // eslint-disable-next-line
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/leagues');
      setLeagues(res.data);
    } catch {
      console.log('Failed to fetch leagues');
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/leagues/create', newLeague, {
        headers: { authorization: token }
      });
      setShowCreate(false);
      fetchLeagues();
    } catch {
      console.log('Failed to create league');
    }
  };

  const handleJoin = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/leagues/join/${id}`, {}, {
        headers: { authorization: token }
      });
      alert('Joined league!');
    } catch {
      alert('Already in this league or error occurred.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#e8201a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem' }}>⚽ Türk Fantezi Futbol</h1>
        <button onClick={handleLogout} style={{ background: 'white', color: '#e8201a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      <div style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Leagues</h2>
          <button onClick={() => setShowCreate(!showCreate)} style={{ background: '#e8201a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Create League
          </button>
        </div>

        {showCreate && (
          <div style={{ background: '#2a2a4e', padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
            <h3 style={{ marginBottom: '12px' }}>New League</h3>
            <input
              placeholder="League name"
              onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: 'none', fontSize: '1rem' }}
            />
            <select
              onChange={(e) => setNewLeague({ ...newLeague, type: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: 'none', fontSize: '1rem' }}
            >
              <option value="fantasy">Fantasy Football</option>
              <option value="prediction">Match Prediction</option>
              <option value="topscorer">Top Scorer</option>
              <option value="transfer">Transfer Market</option>
            </select>
            <button onClick={handleCreate} style={{ background: '#e8201a', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
              Create
            </button>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {leagues.map((league) => (
            <div key={league.id} style={{ background: '#2a2a4e', padding: '20px', borderRadius: '10px' }}>
              <h3 style={{ marginBottom: '8px' }}>{league.name}</h3>
              <p style={{ color: '#aaa', marginBottom: '16px', textTransform: 'capitalize' }}>{league.type}</p>
              <button onClick={() => handleJoin(league.id)} style={{ background: '#e8201a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                Join
              </button>
            </div>
          ))}
        </div>

        {leagues.length === 0 && (
          <p style={{ color: '#aaa', textAlign: 'center', marginTop: '40px' }}>No leagues yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;