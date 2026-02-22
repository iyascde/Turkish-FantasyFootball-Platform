import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStandings, getTopScorers, getFixtures, getLeagues, createLeague, joinLeague } from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const [leagues, setLeagues] = useState([]);
  const [standings, setStandings] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newLeague, setNewLeague] = useState({ name: '', type: 'fantasy' });
  const [activeTab, setActiveTab] = useState('standings');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    // eslint-disable-next-line
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [standingsRes, topScorersRes, fixturesRes, leaguesRes] = await Promise.all([
        getStandings(),
        getTopScorers(),
        getFixtures(),
        getLeagues()
      ]);
      setStandings(standingsRes.data.response[0]?.league?.standings[0] || []);
      setTopScorers(topScorersRes.data.response || []);
      setFixtures(fixturesRes.data.response?.slice(0, 10) || []);
      setLeagues(leaguesRes.data);
    } catch {
      console.log('Failed to fetch data');
    }
  };

  const handleCreate = async () => {
    try {
      const token = localStorage.getItem('token');
      await createLeague(newLeague, token);
      setShowCreate(false);
      fetchData();
    } catch {
      console.log('Failed to create league');
    }
  };

  const handleJoin = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await joinLeague(id, token);
      alert('Joined league!');
    } catch {
      alert('Already in this league or error occurred.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const tabStyle = (tab) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    background: activeTab === tab ? '#e8201a' : '#2a2a4e',
    color: 'white',
    borderRadius: '6px',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  });

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a2e', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      {/* Navbar */}
      <div style={{ background: '#e8201a', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem' }}>⚽ Türk Fantezi Futbol</h1>
        <button onClick={handleLogout} style={{ background: 'white', color: '#e8201a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button style={tabStyle('standings')} onClick={() => setActiveTab('standings')}>Standings</button>
          <button style={tabStyle('topscorers')} onClick={() => setActiveTab('topscorers')}>Top Scorers</button>
          <button style={tabStyle('fixtures')} onClick={() => setActiveTab('fixtures')}>Fixtures</button>
          <button style={tabStyle('leagues')} onClick={() => setActiveTab('leagues')}>My Leagues</button>
        </div>

        {/* Standings Tab */}
        {activeTab === 'standings' && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Süper Lig Standings</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e8201a' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Team</th>
                  <th style={{ padding: '10px' }}>P</th>
                  <th style={{ padding: '10px' }}>W</th>
                  <th style={{ padding: '10px' }}>D</th>
                  <th style={{ padding: '10px' }}>L</th>
                  <th style={{ padding: '10px' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team) => (
                  <tr key={team.team.id} style={{ background: '#2a2a4e', borderBottom: '1px solid #1a1a2e' }}>
                    <td style={{ padding: '10px' }}>{team.rank}</td>
                    <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={team.team.logo} alt={team.team.name} style={{ width: '24px', height: '24px' }} />
                      {team.team.name}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{team.all.played}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{team.all.win}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{team.all.draw}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{team.all.lose}</td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Top Scorers Tab */}
        {activeTab === 'topscorers' && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Top Scorers</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#e8201a' }}>
                  <th style={{ padding: '10px', textAlign: 'left' }}>#</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Player</th>
                  <th style={{ padding: '10px', textAlign: 'left' }}>Team</th>
                  <th style={{ padding: '10px' }}>Goals</th>
                  <th style={{ padding: '10px' }}>Assists</th>
                </tr>
              </thead>
              <tbody>
                {topScorers.map((item, index) => (
                  <tr key={item.player.id} style={{ background: '#2a2a4e', borderBottom: '1px solid #1a1a2e' }}>
                    <td style={{ padding: '10px' }}>{index + 1}</td>
                    <td style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <img src={item.player.photo} alt={item.player.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                      {item.player.name}
                    </td>
                    <td style={{ padding: '10px' }}>{item.statistics[0]?.team?.name}</td>
                    <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold' }}>{item.statistics[0]?.goals?.total}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{item.statistics[0]?.goals?.assists || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Fixtures Tab */}
        {activeTab === 'fixtures' && (
          <div>
            <h2 style={{ marginBottom: '16px' }}>Recent & Upcoming Fixtures</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {fixtures.map((fixture) => (
                <div key={fixture.fixture.id} style={{ background: '#2a2a4e', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} style={{ width: '30px' }} />
                    <span>{fixture.teams.home.name}</span>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {fixture.fixture.status.short === 'FT' ? (
                      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {fixture.goals.home} - {fixture.goals.away}
                      </span>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                        {new Date(fixture.fixture.date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span>{fixture.teams.away.name}</span>
                    <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} style={{ width: '30px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leagues Tab */}
        {activeTab === 'leagues' && (
          <div>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;