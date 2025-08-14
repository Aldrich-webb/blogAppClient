import { useState } from "react";
import Axios from "../api";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
	const { user } = useAuth();
	const [showForm, setShowForm] = useState(false);

	const [title, setTitle] = useState("");
	const [director, setDirector] = useState("");
	const [year, setYear] = useState("");
	const [description, setDescription] = useState("");
	const [genre, setGenre] = useState("");

	const handleAddMovie = async (e) => {
		e.preventDefault();
		try {
			await Axios.post("/movies/addMovie", {
				title,
				director,
				year,
				description,
				genre,
			});
      toast.success("Movie updated successfully!");
			setShowForm(false);
			setTitle("");
			setDirector("");
			setYear("");
			setDescription("");
			setGenre("");
		} catch (err) {
			console.error(err);
      toast.error("Failed to add movie.");
		}
	};

	if (!user) {
		return <div className="text-center mt-5">You are not logged in.</div>;
	}

	return (
		<div className="container mt-5 w-100 w-md-50">
			<div className="d-flex flex-column flex-lg-row align-items-center justify-content-between">
				<h1 className="mb-4">Profile</h1>
			</div>

			<div className="card p-4 shadow">
				<h5><strong>Email:</strong> {user.email}</h5>
				<h6><strong>Role:</strong> {user.isAdmin ? "Admin" : "User"}</h6>
			</div>

			{showForm && (
				<div className="card mt-4 p-4 shadow-sm">
					<h4 className="mb-3">Add New Movie</h4>
					<form onSubmit={handleAddMovie}>
						<div className="mb-3">
							<label>Title:</label>
							<input
								type="text"
								className="form-control"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>

						<div className="mb-3">
							<label>Director:</label>
							<input
								type="text"
								className="form-control"
								value={director}
								onChange={(e) => setDirector(e.target.value)}
								required
							/>
						</div>

						<div className="mb-3">
							<label>Year:</label>
							<input
								type="number"
								className="form-control"
								value={year}
								onChange={(e) => setYear(e.target.value)}
								required
								min="1800"
								max={new Date().getFullYear()}
							/>
						</div>

						<div className="mb-3">
							<label>Genre:</label>
							<input
								type="text"
								className="form-control"
								value={genre}
								onChange={(e) => setGenre(e.target.value)}
								required
							/>
						</div>

						<div className="mb-3">
							<label>Description:</label>
							<textarea
								className="form-control"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>

						<div className="d-flex gap-2">
							<button type="submit" className="btn btn-success">Save</button>
							<button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default Profile;
