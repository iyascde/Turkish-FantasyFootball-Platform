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
        getStandings(), getTopScorers(), getFixtures(), getLeagues()
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {['predictions', 'leaderboard'].map((page) => (
            <button key={page} onClick={() => navigate(`/${page}`)} style={{
              background: 'transparent',
              color: 'rgba(255,255,255,0.7)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '0.9rem',
              textTransform: 'capitalize',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(255,255,255,0.08)'; e.target.style.color = 'white'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.7)'; }}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
          <button onClick={handleLogout} style={{
            background: '#e8201a',
            color: 'white',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9rem',
            marginLeft: '8px'
          }}>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero bar */}
      <div style={{
        background: 'linear-gradient(135deg, #e8201a 0%, #9b0f0b 100%)',
        padding: '32px 40px',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '4px' }}>Süper Lig Hub</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.95rem' }}>2024 Season — Live standings, fixtures & fantasy leagues</p>
      </div>

      <div style={{ padding: '32px 40px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '28px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
          {['standings', 'topscorers', 'fixtures', 'leagues'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: '8px 20px',
              background: activeTab === tab ? '#e8201a' : 'transparent',
              color: activeTab === tab ? 'white' : 'rgba(255,255,255,0.5)',
              border: 'none',
              borderRadius: '7px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.85rem',
              textTransform: 'capitalize',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}>
              {tab === 'topscorers' ? 'Top Scorers' : tab === 'leagues' ? 'My Leagues' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Standings */}
        {activeTab === 'standings' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', color: 'rgba(255,255,255,0.9)' }}>League Table</h2>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['#', 'Club', 'P', 'W', 'D', 'L', 'GD', 'Pts'].map((h) => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Club' ? 'left' : 'center', fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {standings.map((team, i) => (
                    <tr key={team.team.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600' }}>
                        <span style={{ color: team.rank <= 2 ? '#e8201a' : team.rank <= 4 ? '#f59e0b' : 'rgba(255,255,255,0.5)' }}>{team.rank}</span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={team.team.logo} alt={team.team.name} style={{ width: '22px', height: '22px', objectFit: 'contain' }} />
                          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{team.team.name}</span>
                        </div>
                      </td>
                      {[team.all.played, team.all.win, team.all.draw, team.all.lose, (team.goalsDiff > 0 ? '+' : '') + team.goalsDiff].map((val, j) => (
                        <td key={j} style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)' }}>{val}</td>
                      ))}
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Top Scorers */}
        {activeTab === 'topscorers' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Top Scorers</h2>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['#', 'Player', 'Club', 'Goals', 'Assists'].map((h) => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Player' || h === 'Club' ? 'left' : 'center', fontSize: '0.75rem', fontWeight: '600', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topScorers.map((item, index) => (
                    <tr key={item.player.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: index < 3 ? '#e8201a' : 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>{index + 1}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={item.player.photo} alt={item.player.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{item.player.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{item.statistics[0]?.team?.name}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '800', fontSize: '1rem', color: '#e8201a' }}>{item.statistics[0]?.goals?.total}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{item.statistics[0]?.goals?.assists || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fixtures */}
        {activeTab === 'fixtures' && (
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px' }}>Fixtures & Results</h2>
            <div style={{ display: 'grid', gap: '8px' }}>
              {fixtures.map((fixture) => (
                <div key={fixture.fixture.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  padding: '16px 24px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} style={{ width: '28px', objectFit: 'contain' }} />
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{fixture.teams.home.name}</span>
                  </div>
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    {fixture.fixture.status.short === 'FT' ? (
                      <div>
                        <span style={{ fontWeight: '800', fontSize: '1.3rem', letterSpacing: '2px' }}>{fixture.goals.home} — {fixture.goals.away}</span>
                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px' }}>FT</div>
                      </div>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(fixture.fixture.date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, justifyContent: 'flex-end' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{fixture.teams.away.name}</span>
                    <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} style={{ width: '28px', objectFit: 'contain' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Leagues */}
        {activeTab === 'leagues' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700' }}>My Leagues</h2>
              <button onClick={() => setShowCreate(!showCreate)} style={{
                background: '#e8201a',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem'
              }}>
                + New League
              </button>
            </div>

            {showCreate && (
              <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', borderRadius: '12px', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '16px', fontSize: '1rem', fontWeight: '700' }}>Create League</h3>
                <input
                  placeholder="League name"
                  onChange={(e) => setNewLeague({ ...newLeague, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', marginBottom: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box' }}
                />
                <select
                  onChange={(e) => setNewLeague({ ...newLeague, type: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', marginBottom: '16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: '#1a1a2e', color: 'white', fontSize: '0.95rem', boxSizing: 'border-box' }}
                >
                  <option value="fantasy">Fantasy Football</option>
                  <option value="prediction">Match Prediction</option>
                  <option value="topscorer">Top Scorer</option>
                  <option value="transfer">Transfer Market</option>
                </select>
                <button onClick={handleCreate} style={{ background: '#e8201a', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Create
                </button>
              </div>
            )}

            {leagues.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🏆</div>
                <p style={{ fontSize: '1rem', fontWeight: '600' }}>No leagues yet</p>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Create one to get started</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
                {leagues.map((league) => (
                  <div key={league.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h3 style={{ fontWeight: '700', fontSize: '1rem' }}>{league.name}</h3>
                      <span style={{ background: 'rgba(232,32,26,0.15)', color: '#e8201a', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600', textTransform: 'capitalize' }}>{league.type}</span>
                    </div>
                    <button onClick={() => handleJoin(league.id)} style={{ background: 'transparent', color: '#e8201a', border: '1px solid #e8201a', padding: '7px 16px', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}>
                      Join League
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;