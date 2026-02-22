import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      navigate('/login');
    } catch {
      setError('Registration failed. Try a different username or email.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(232,32,26,0.12) 0%, transparent 70%)',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '40px',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⚽</div>
          <h2 style={{ color: 'white', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '4px' }}>Create account</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>Join Türk Fantezi Futbol</p>
        </div>
        {error && (
          <div style={{ background: 'rgba(232,32,26,0.1)', border: '1px solid rgba(232,32,26,0.3)', color: '#ff6b6b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {[
            { name: 'username', type: 'text', placeholder: 'Username' },
            { name: 'email', type: 'email', placeholder: 'Email' },
            { name: 'password', type: 'password', placeholder: 'Password' }
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px 14px',
                marginBottom: '12px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.05)',
                color: 'white',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          ))}
          <button type="submit" style={{
            width: '100%',
            padding: '13px',
            background: '#e8201a',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            cursor: 'pointer',
            fontWeight: '700',
            marginTop: '4px'
          }}>
            Create Account
          </button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#e8201a', cursor: 'pointer', fontWeight: '600' }}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;