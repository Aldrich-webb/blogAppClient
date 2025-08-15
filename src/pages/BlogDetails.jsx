import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const BlogDetails = () => {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/posts/post/${postId}`);
      setPost(res.data);
      setEditTitle(res.data.title);
      setEditContent(res.data.content);
    } catch (err) {
      console.error("Error fetching post:", err);
      toast.error("Failed to load blog post.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const canEditDelete = user && post && (
    user.id === post.author || 
    user.isAdmin ||
    (post.author && typeof post.author === 'object' && user.id === post.author._id)
  );

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editContent.trim()) {
      return toast.error("Please fill in all fields");
    }

    try {
      const res = await API.patch(`/posts/post/${postId}`, { 
        title: editTitle, 
        content: editContent 
      });
      if (res.status === 200) {
        toast.success("Post updated successfully");
        setEditMode(false);
        fetchPost(); // Refresh the post
      }
    } catch (err) {
      console.error("Error updating post:", err);
      if (err.response?.status === 403) {
        toast.error("You can only edit your own posts");
      } else {
        toast.error("Failed to update post");
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await API.delete(`/posts/post/${postId}`);
      if (res.status === 200) {
        toast.success("Post deleted successfully");
        navigate("/"); // Redirect to home page
      }
    } catch (err) {
      console.error("Error deleting post:", err);
      if (err.response?.status === 403) {
        toast.error("You can only delete your own posts");
      } else {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return toast.error("Comment cannot be empty");

    try {
      const res = await API.patch(`/posts/post/comment/${postId}`, {
        comment: commentText,
      });
      
      if (res.status !== 200) {
        throw new Error("Add comment failed");
      }
      
      toast.success("Comment added");
      setCommentText("");
      fetchPost();
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await API.delete(`/posts/post/${postId}/comment/${commentId}`);
      
      if (res.status !== 200) {
        throw new Error("Delete comment failed");
      }
      
      toast.success("Comment deleted");
      fetchPost();
    } catch (err) {
      console.error("Error deleting comment:", err);
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border m-3"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!post) {
    return <div className="container py-4 text-center">Post not found.</div>;
  }

  return (
    <div className="container py-5">
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <Link to="/" className="btn btn-outline-secondary">
          ← Back to Blogs
        </Link>
        
        {/* Edit/Delete buttons for post owner */}
        {canEditDelete && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-primary"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "Cancel Edit" : "Edit Post"}
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={handleDelete}
            >
              Delete Post
            </button>
          </div>
        )}
      </div>

      {/* Edit Form */}
      {editMode ? (
        <div className="card p-4 mb-4">
          <h4 className="mb-3">Edit Post</h4>
          <form onSubmit={handleEdit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                rows="8"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Update Post
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        // Display Post
        <>
          <h1 className="mb-3">{post.title}</h1>
          <p className="text-muted">
            By <strong>{typeof post.author === 'object' ? post.author.username : "Unknown Author"}</strong> •{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          <hr />

          <div className="mt-4" style={{ whiteSpace: "pre-line" }}>
            {post.content}
          </div>
        </>
      )}

      {/* Comments Section */}
      <div className="mt-5">
        <h4 className="mb-3">Comments</h4>

        {/* List Comments */}
        {post.comments?.length > 0 ? (
          <ul className="list-group mb-4">
            {post.comments.map((cmt) => (
              <li key={cmt._id} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <strong>{cmt.userId || "Anonymous"}:</strong> {cmt.comment}
                  <br />
                  <small className="text-muted">{new Date(cmt.createdAt).toLocaleString()}</small>
                </div>
                {user?.isAdmin && (
                  <button
                    onClick={() => handleDeleteComment(cmt._id)}
                    className="btn btn-sm btn-danger ms-3"
                  >
                    Delete
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}

        {/* Add Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-3">
              <label htmlFor="comment" className="form-label">Add a comment</label>
              <textarea
                id="comment"
                className="form-control"
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit Comment</button>
          </form>
        ) : (
          <p><Link to="/login">Log in</Link> to post a comment.</p>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;