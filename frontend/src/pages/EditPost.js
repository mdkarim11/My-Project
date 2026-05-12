import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({ title: '', body: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);
        setPost({ title: data.title, body: data.body });
      } catch (err) {
        setError('Unable to load post');
      }
    };
    loadPost();
  }, [id]);

  const handleChange = (e) => setPost({ ...post, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/posts/${id}`, post);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update post');
    }
  };

  return (
    <section className="auth-panel">
      <div className="card soft">
        <h1>Edit Post</h1>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input name="title" type="text" value={post.title} onChange={handleChange} required />
          <label>Body</label>
          <textarea name="body" rows="10" value={post.body} onChange={handleChange} required />
          {error && <div className="alert">{error}</div>}
          <button type="submit" className="button">Save Changes</button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
