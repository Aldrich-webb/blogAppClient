import { useState } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();
  const { login } = useAuth();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const res = await API.post("/users/login", { email, password });

			if (res.status !== 200) {
				throw new Error("Login failed");
			}

			const token = res.data.access;
      login(token);
      
			navigate("/");
		} catch (err) {
			console.log(err || "Login failed");
			toast.error(err.response?.data?.message || "Login failed.");
		}
	};

	return (
		<form
			onSubmit={handleLogin}
			className="mx-auto d-flex flex-column justify-content-center align-items-center mt-5"
			style={{ maxWidth: "400px" }}
		>
			<h2 className='mt-5 pt-5 pb-4'>Login</h2>
			<div className="mb-3 w-100">
				<label>Email:</label>
				<input
					type="email"
					value={email}
					className="form-control"
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div className="mb-3 w-100">
				<label>Password:</label>
				<input
					type="password"
					value={password}
					className="form-control"
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<button className="btn btn-primary w-100">Login</button>
			<p className="my-5">Already have an account? &nbsp;
				<Link to="/register">Register</Link></p>
		</form>
	);
};

export default Login;
