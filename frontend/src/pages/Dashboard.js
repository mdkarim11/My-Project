import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import PostCard from '../components/PostCard';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('blogUser') || 'null');

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (err) {
      setError('Unable to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(posts.filter((post) => post._id !== id));
    } catch (err) {
      setError('Could not delete post');
    }
  };

  return (
    <section className="dashboard-panel">
      <div className="hero-card soft">
        <h1>Simple blog for storytellers</h1>
        <p>Share ideas, edit posts, and manage your feed with authentication built in.</p>
        <div className="hero-actions">
          <button onClick={() => navigate('/new')} className="button">Write a Post</button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading ? (
        <div className="loader">Loading posts...</div>
      ) : (
        <div className="post-grid">
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              isOwner={user?.id === post.author?._id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Dashboard;
