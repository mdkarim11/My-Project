import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const NewPost = () => {
  const [post, setPost] = useState({ title: '', body: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setPost({ ...post, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', post);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create post');
    }
  };

  return (
    <section className="auth-panel">
      <div className="card soft">
        <h1>New Blog Post</h1>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" type="text" value={post.title} onChange={handleChange} required />
          <label>Body</label>
          <textarea name="body" rows="10" value={post.body} onChange={handleChange} required />
          {error && <div className="alert">{error}</div>}
          <button type="submit" className="button">Publish Post</button>
        </form>
      </div>
    </section>
  );
};

export default NewPost;
