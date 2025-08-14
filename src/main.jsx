import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import App from './App.jsx'
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<App />
				<ToastContainer position="bottom-right" autoClose={3000} />
			</AuthProvider>
		</BrowserRouter>
	</StrictMode>
)
