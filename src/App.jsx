/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */


import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './modules/Dashboard';
import Form from './modules/Form';
import TaskDashboard from './page/TaskDashboard';
import Profile from './page/Profile';
import Otp from './modules/Otp';
import Forgotpassword from './modules/Forgotpassword';

const ProtectedRoute = ({ children, auth }) => {
	const isLoggedIn = localStorage?.getItem('access_token') !== null ;
	const location = useLocation();

	if (!isLoggedIn && auth) {
		return <Navigate to="/users/sign_in" replace />;
	} else if (isLoggedIn && (location.pathname === '/users/sign_in' || location.pathname === '/users/sign_up')) {
		return <Navigate to="/" />;
	}

	return children;
};



	export default function App() {
		return (
			<Routes>
				{/* Protected Route for TaskDashboard with children */}
				<Route path="/" element={<ProtectedRoute auth={true}><Dashboard /></ProtectedRoute>}>
					<Route index element={<TaskDashboard />} />
					<Route path="profile" element={<Profile />} /> 
				</Route>
	
				{/* Sign-in and Sign-up Routes */}
				<Route path="/users/sign_in" element={<Form isSignInPage={true} />} />
				<Route path="/users/sign_up" element={<Form isSignInPage={false} />} />
				<Route path="/users/otp" element={<Otp />} />
				<Route path="/users/forgot-password" element={<Forgotpassword isForgotPage={true}/>} />
				<Route path="/users/reset-password/:token" element={<Forgotpassword isForgotPage={false}/>} />
			</Routes>
		);
	}
