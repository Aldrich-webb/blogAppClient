import { useEffect, useState } from "react";
import API from "../api";
import BlogCard from "./BlogPostCard";
import { toast } from "react-toastify";

const UserView = () => {
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
    // if (!title || !content) return toast.error("Please fill in all fields");

    try {
      if (editMode) {
        const res = await API.patch(`/posts/post/${editId}`, { title, content });
        if (res.status === 200) {
          setPosts((prev) =>
            prev.map((post) => (post._id === editId ? res.data.updatedPost : post))
          );
          toast.success("Post updated");
        }
      } else {
        const res = await API.post("/posts/post", { title, content });
        if (res.status === 201) {
          setPosts((prev) => [res.data, ...prev]);
          toast.success("Post created");
        }
      }

      // Reset states after successful operation
      setTitle("");
      setContent("");
      setEditId(null);
      setEditMode(false);
      setShowForm(false);
			fetchBlogs();
    } catch (err) {
      console.error("Error submitting post:", err);
      toast.error("Post submission failed");
    }
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
				<button
					className="btn btn-success"
					onClick={() => setShowForm((prev) => !prev)}
				>
					{showForm ? "Close Form" : "Add New Post"}
				</button>
			</div>

			{/* Blog Post Input Form Layer */}
			{showForm && (
				<div className="card p-4 mb-5 border-primary border- shadow-lg">
					<h4 className="mb-3">Add New Blog Post</h4>
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
						
						<button	type="submit"	className="btn btn-primary px-4">Post Blog</button>
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
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default UserView;
