import { useEffect, useState } from "react";
import API from "../api";
import BlogCard from "./BlogPostCard";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const UserView = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return toast.error("Please fill in all fields");
    }

    try {
      if (editMode) {
        const res = await API.patch(`/posts/post/${editId}`, { title, content });
        if (res.status === 200) {
          toast.success("Post updated successfully");
          resetForm();
          fetchBlogs(); // Refresh the posts
        }
      } else {
        const res = await API.post("/posts/post", { title, content });
        if (res.status === 201) {
          toast.success("Post created successfully");
          resetForm();
          fetchBlogs(); // Refresh the posts
        }
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      if (err.response?.status === 403) {
        toast.error("You can only edit your own posts");
      } else {
        toast.error(editMode ? "Failed to update post" : "Failed to create post");
      }
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditId(null);
    setEditMode(false);
    setShowForm(false);
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditId(post._id);
    setEditMode(true);
    setShowForm(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const res = await API.delete(`/posts/post/${postId}`);
      if (res.status === 200) {
        toast.success("Post deleted successfully");
        setPosts(prev => prev.filter(post => post._id !== postId));
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

  const cancelEdit = () => {
    if (editMode) {
      setEditMode(false);
      setEditId(null);
      setTitle("");
      setContent("");
    }
    setShowForm(false);
  };
  
  if (loading)
    return (
      <div className="text-center my-5 py-5">
        <div className="spinner-border m-3"></div>
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center my-5 gap-2">
        <h2 className="m-0">Blog Posts</h2>
        {user && (
          <button
            className="btn btn-success"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Close Form" : "Add New Post"}
          </button>
        )}
      </div>

      {/* Blog Post Input Form Layer */}
      {showForm && user && (
        <div className="card p-4 mb-5 border-primary border-2 shadow-lg">
          <h4 className="mb-3">
            {editMode ? "Edit Blog Post" : "Add New Blog Post"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                rows="5"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary px-4">
                {editMode ? "Update Post HAHA" : "Create Post"}
              </button>
              {editMode && (
                <button 
                  type="button" 
                  className="btn btn-secondary px-4"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Blog List */}
      {posts.length === 0 ? (
        <p className="text-center">No blog posts found.</p>
      ) : (
        <div className="d-flex flex-column gap-5 pb-3">
          {posts.map((post, index) => (
            <BlogCard
              key={post._id || index}
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserView;