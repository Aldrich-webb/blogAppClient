import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const BlogCard = ({ post, onDelete, onEdit }) => {
  const { user } = useAuth();
  
  if (!post || !post.content) return null;

  const canEditDelete = user && (
    user.id === post.author || 
    user.isAdmin ||
    (post.author && typeof post.author === 'object' && user.id === post.author._id)
  );

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between border-bottom pb-2">
          <h5 className="card-title">{post.title}</h5>
          <small className="text-muted">
            {new Date(post.createdAt).toLocaleDateString()}
          </small>
        </div>
        
        {/* Author info */}
        <p className="text-muted small mt-2 mb-3">
          By: {typeof post.author === 'object' ? post.author.username : 'Unknown Author'}
        </p>
        
        <p className="card-text">
          {post.content.length > 400
            ? post.content.substring(0, 400) + "..."
            : post.content}
        </p>
        
        <div className="d-flex gap-3 justify-content-between align-items-center">
          <Link 
            to={`/posts/${post._id}`} 
            className="btn btn-outline-primary btn-sm px-4 py-2"
          >
            Read More
          </Link>
          
          {/* Edit/Delete buttons - only show for post owner or admin */}
          {canEditDelete && (
            <div className="d-flex gap-2">
              {onEdit && (
                <button 
                  className="btn btn-outline-success btn-sm px-3 py-2" 
                  onClick={() => onEdit(post)}
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button 
                  className="btn btn-outline-danger btn-sm px-3 py-2" 
                  onClick={() => onDelete(post._id)}
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCard;