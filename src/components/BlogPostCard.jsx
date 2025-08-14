import { Link } from "react-router-dom";

const BlogCard = ({ post, onDelete, onEdit }) => {
  if (!post || !post.content) return null;

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between border-bottom pb-2">
          <h5 className="card-title">{post.title}</h5>
          <small className="text-muted">
            {new Date(post.createdAt).toLocaleDateString()}
          </small>
        </div>
        <p className="card-text pt-4">
          {post.content.length > 400
            ? post.content.substring(0, 400) + "..."
            : post.content}
        </p>
        <div className="d-flex gap-3 justify-content-between">
          <Link to={`/posts/${post._id}`} className="btn btn-outline-primary btn-sm px-4 py-2">
            Read More
          </Link>
          <div className="d-flex gap-3">
            {onEdit && (
              <button className="btn btn-outline-success btn-sm px-4 py-2" onClick={onEdit}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="btn btn-outline-danger btn-sm px-4 py-2" onClick={onDelete}>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
