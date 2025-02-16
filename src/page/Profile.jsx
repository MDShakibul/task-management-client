/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import {
	useGetUserProfileQuery,
	useUpdateUserProfileMutation,
} from '../redux/api/apiSlice';

const Profile = () => {
	const {
		data: userData,
		isLoading,
		error,
	} = useGetUserProfileQuery();
	const [updateUserProfile, { isUpdateLoading, isError, isSuccess }] =
		useUpdateUserProfileMutation();


	const [userInfo, setUserInfo] = useState({
		name: '',
		email: '',
	});

	const [isEditing, setIsEditing] = useState(false);

	useEffect(() => {
		if (userData?.data) {
			setUserInfo({
				name: userData.data.name || '',
				email: userData.data.email || '',
			});
		}
	}, [userData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserInfo((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		console.log(userInfo);
		const options = {
			data: {
				name: userInfo?.name,
				email: userInfo?.email,
			},
		};
		const response = await updateUserProfile(options);

		if ('data' in response) {
			Swal.fire({
				position: 'center',
				icon: 'success',
				text: `${response?.data?.message}`,
				showConfirmButton: false,
				timer: 2000,
				allowOutsideClick: false,
				allowEscapeKey: false,
			}).then((result) => {
				if (result.dismiss === Swal.DismissReason.timer) {
					setIsEditing(false);
				}
			});
		}

		if ('error' in response) {
			Swal.fire({
				position: 'center',
				icon: 'error',
				text: `${response?.error?.data?.message}`,
				showConfirmButton: false,
				timer: 1000,
				allowOutsideClick: false,
				allowEscapeKey: false,
			});
		}
	};


	const toggleEdit = () => {
		setIsEditing((prev) => !prev);
	};


	if (isLoading) return <p>Loading profile...</p>;
	if (error)
		return (
			<p className="text-red-500">Error loading profile. Please try again.</p>
		);

	return (
		<div className="p-6 max-w-xl mx-auto">
			<h1 className="text-3xl font-semibold mb-4">User Profile</h1>

			{!isEditing ? (
				// Displaying User Info
				<div className="mb-6">
					<p>
						<strong>Name:</strong> {userInfo.name}
					</p>
					<p>
						<strong>Email:</strong> {userInfo.email}
					</p>
					<button
						onClick={toggleEdit}
						className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
					>
						Edit Profile
					</button>
				</div>
			) : (
				
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-lg font-semibold">Name</label>
						<input
							type="text"
							name="name"
							value={userInfo.name}
							onChange={handleChange}
							className="w-full px-4 py-2 border rounded-lg"
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-lg font-semibold">Email</label>
						<input
							type="email"
							name="email"
							value={userInfo.email}
							className="w-full px-4 py-2 border rounded-lg"
							required
							readOnly
						/>
					</div>
					<div className="flex justify-between">
						<button
							type="submit"
							className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
						>
							Save Changes
						</button>
						<button
							type="button"
							onClick={toggleEdit}
							className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
						>
							Cancel
						</button>
					</div>
				</form>
			)}
		</div>
	);
};

export default Profile;
