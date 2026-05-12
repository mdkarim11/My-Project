import { Link } from 'react-router-dom';

const PostCard = ({ post, isOwner, onDelete }) => {
  return (
    <article className="post-card">
      <div className="post-header">
        <h2>{post.title}</h2>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <p>{post.body}</p>
      <div className="post-meta">
        <span>By {post.author?.name || 'Unknown author'}</span>
        {isOwner && (
          <div className="post-actions">
            <Link to={`/edit/${post._id}`} className="button small">Edit</Link>
            <button onClick={() => onDelete(post._id)} className="button small secondary">Delete</button>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
