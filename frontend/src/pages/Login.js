import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('blogToken', data.token);
      localStorage.setItem('blogUser', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="auth-panel">
      <div className="card soft">
        <h1>Welcome Back</h1>
        <p>Login to manage your blog posts.</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
          {error && <div className="alert">{error}</div>}
          <button type="submit" className="button">Login</button>
        </form>
        <p className="small-note">Need an account? <Link to="/register">Register</Link></p>
      </div>
    </section>
  );
};

export default Login;
