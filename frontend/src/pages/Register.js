import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('blogToken', data.token);
      localStorage.setItem('blogUser', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <section className="auth-panel">
      <div className="card soft">
        <h1>Create Account</h1>
        <p>Start publishing your stories today.</p>
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input name="name" type="text" value={form.name} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
          {error && <div className="alert">{error}</div>}
          <button type="submit" className="button">Register</button>
        </form>
        <p className="small-note">Already registered? <Link to="/login">Login</Link></p>
      </div>
    </section>
  );
};

export default Register;
