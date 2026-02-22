import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(232,32,26,0.15) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>⚽</div>
        <h1 style={{ fontSize: '3.2rem', fontWeight: '900', letterSpacing: '-1.5px', marginBottom: '12px', lineHeight: 1.1 }}>
          Türk Fantezi Futbol
        </h1>
        <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', marginBottom: '48px', maxWidth: '400px', lineHeight: 1.6 }}>
          The ultimate fantasy football platform for Süper Lig fans
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '14px 32px',
              fontSize: '0.95rem',
              background: '#e8201a',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              letterSpacing: '-0.2px'
            }}
          >
            Get Started
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 32px',
              fontSize: '0.95rem',
              background: 'rgba(255,255,255,0.06)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700'
            }}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;