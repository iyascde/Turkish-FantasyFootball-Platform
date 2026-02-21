import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e8201a, #1a1a2e)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>⚽ Türk Fantezi Futbol</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px', opacity: 0.8 }}>
        Süper Lig'in en iyi fantezi platformu
      </p>
      <div style={{ display: 'flex', gap: '20px' }}>
        <button
          onClick={() => navigate('/register')}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            background: 'white',
            color: '#e8201a',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Get Started
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            background: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Home;