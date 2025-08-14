import { useEffect, useState } from "react";
import API from "../api";
import BlogCard from "../components/BlogPostCard";

const GuestView = () => {
	const [posts, setPosts] = useState([]);
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
	
	if (loading)
		return (
			<div className="text-center my-5 py-5">
				<div className="spinner-border m-3"></div>
				<p>Loading...</p>
			</div>
		);

	return (
		<div className="container py-4">
			<h2 className="text-center pt-5 pb-5">Latest Blog Posts</h2>

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

export default GuestView;
