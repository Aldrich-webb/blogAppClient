import { useAuth } from '../contexts/AuthContext';
import GuestView from '../components/GuestView'
import UserView from '../components/UserView';
import Dashboard from '../components/Dashboard';

const Home = () => {
	const { user } = useAuth();
	
	if (!user) return <GuestView />;
	if (user.isAdmin) return <Dashboard />;
	return <UserView />;
}

export default Home