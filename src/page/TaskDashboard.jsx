/* eslint-disable no-unused-vars */
import { Edit, Plus, Trash } from 'lucide-react';
import { useState } from 'react';
import Swal from 'sweetalert2';
import {
	useAddTaskMutation,
	useDeleteTaskMutation,
	useGetTaskListsQuery,
	useUpdateTaskMutation,
} from '../redux/api/apiSlice';
import { formatDate } from '../utils';

const TaskDashboard = () => {
	const [searchInfo, setSearchInfo] = useState({
		status: '',
		due_date: '',
		page: '',
		limit: '',
		sortBy: '',
		sortOrder: '',
	});
	const { data: tasks, isLoading, error } = useGetTaskListsQuery(searchInfo);

	const [newTask, setNewTask] = useState({
		title: '',
		description: '',
		due_date: '',
	});
	const [editTask, setEditTask] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [filter, setFilter] = useState({ status: '', due_date: '' });

	const [addNewTask, { isTaskNewLoading, isError, isSuccess }] =
		useAddTaskMutation();

	const addTask = async () => {
		if (newTask.title.trim() === '') {
			Swal.fire({
				position: 'center',
				icon: 'error',
				text: 'Title is required',
				showConfirmButton: false,
				timer: 1000,
				allowOutsideClick: false,
				allowEscapeKey: false,
			});
			return 0;
		}
		if (newTask.description.trim() === '') {
			Swal.fire({
				position: 'center',
				icon: 'error',
				text: 'Description is required',
				showConfirmButton: false,
				timer: 1000,
				allowOutsideClick: false,
				allowEscapeKey: false,
			});
			return 0;
		}
		if (isNaN(new Date(newTask.due_date))) {
			Swal.fire({
				position: 'center',
				icon: 'error',
				text: 'Date is required',
				showConfirmButton: false,
				timer: 1000,
				allowOutsideClick: false,
				allowEscapeKey: false,
			});
			return 0;
		}
		

		const options = {
			data: {
				title: newTask.title,
				description: newTask.description,
				due_date: new Date(newTask.due_date).toISOString(),
			},
		};



		const response = await addNewTask(options);

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
					setNewTask({ title: '', description: '', due_date: '' });
					setIsModalOpen(false);
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

	const [deleteExistTask] = useDeleteTaskMutation();


	const deleteTask = (id) => {
		Swal.fire({
			title: 'Are you sure?',
			text: 'Do you want to delete this task?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Yes, Delete',
			cancelButtonText: 'No, Thanks',
			customClass: {
				container: 'custom-subscription-swal-buttons',
			},
		}).then(async (result) => {
			if (result.isConfirmed) {
				const response =  await deleteExistTask(id);
				if (response.error) {
					console.log(response.error.message)
				} 
	
			}
		});
	};



	const openEditModal = (task) => {
		setEditTask(task);
		setIsEditModalOpen(true);
	};


	const [updateExistTask] = useUpdateTaskMutation();

	const updateTask = async() => {
		const options = {
			data: {
				title: editTask.title,
				description: editTask.description,
				due_date: new Date(editTask.due_date).toISOString(),
				status: editTask.status,
			},
		};

		const response =await updateExistTask({ id: editTask.id, data:options })

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
					setIsEditModalOpen(false);
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


	const handleFilterChange = (e) => {
		const { name, value } = e.target;
	
		setSearchInfo((prev) => ({
			...prev,
			[name]: name === "status" ? (value ? parseInt(value, 10) : '') : value,
		}));
	};



	return (
		<>
			{/* Main Content */}

			<h2 className="text-2xl font-semibold mb-4">Dashboard</h2>

        {/* Filter Section */}
        <div className="flex gap-4 mb-4">
            <select
                name="status"
                value={parseInt(searchInfo.status)}
                onChange={handleFilterChange}
                className="border p-2 rounded-lg"
            >
                <option value="">Filter by Status</option>
                <option value="1">Pending</option>
                <option value="2">Completed</option>
            </select>

            <input
                type="date"
                name="due_date"
                value={searchInfo.due_date}
                onChange={handleFilterChange}
                className="border p-2 rounded-lg"
            />
        </div>

			{/* Add Task Button */}
			<button
				onClick={() => setIsModalOpen(true)}
				className="bg-blue-600 text-white p-2 rounded-lg flex items-center mb-4"
			>
				<Plus size={20} className="mr-2" /> Add Task
			</button>

			{/* Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-xl font-semibold mb-4">Add New Task</h2>
						<input
							type="text"
							placeholder="Title"
							value={newTask.title}
							onChange={(e) =>
								setNewTask({ ...newTask, title: e.target.value })
							}
							className="border rounded-lg p-2 w-full mb-2"
						/>
						<textarea
							placeholder="Details"
							value={newTask.description}
							onChange={(e) =>
								setNewTask({ ...newTask, description: e.target.value })
							}
							className="border rounded-lg p-2 w-full mb-2"
						/>
						<input
							type="date"
							value={newTask.due_date}
							onChange={(e) =>
								setNewTask({ ...newTask, due_date: e.target.value })
							}
							className="border rounded-lg p-2 w-full mb-2"
						/>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setIsModalOpen(false)}
								className="bg-gray-400 text-white p-2 rounded-lg"
							>
								Cancel
							</button>
							<button
								onClick={addTask}
								className="bg-blue-600 text-white p-2 rounded-lg"
							>
								Add
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Edit Modal */}
			{isEditModalOpen && editTask && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
					<div className="bg-white p-6 rounded-lg shadow-lg w-96">
						<h2 className="text-xl font-semibold mb-4">Edit Task</h2>
						<input type="hidden" value={editTask.id}
							onChange={(e) =>
								setEditTask({ ...editTask, id: e.target.value })
							} />
						<input
							type="text"
							placeholder="Title"
							value={editTask.title}
							onChange={(e) =>
								setEditTask({ ...editTask, title: e.target.value })
							}
							className="border rounded-lg p-2 w-full mb-2"
						/>
						<textarea
							placeholder="Details"
							value={editTask.description}
							onChange={(e) =>
								setEditTask({ ...editTask, description: e.target.value })
							}
							className="border rounded-lg p-2 w-full mb-2"
						/>
						<input
							type="date"
							value={
								editTask.due_date
									? new Date(editTask.due_date).toISOString().split('T')[0]
									: ''
							}
							onChange={(e) =>
								setEditTask({ ...editTask, due_date: e.target.value })
							}
							className="border rounded-lg p-2 w-full mb-2"
						/>
						<select
							value={editTask.status?.toString()}
							onChange={(e) =>
								setEditTask({ ...editTask, status: parseInt(e.target.value) })
							}
							className="border p-1 rounded-lg mb-2 w-full"
						>
							<option value="1">Pending</option>
							<option value="2">Completed</option>
						</select>
						<div className="flex justify-end gap-2">
							<button
								onClick={() => setIsEditModalOpen(false)}
								className="bg-gray-400 text-white p-2 rounded-lg"
							>
								Cancel
							</button>
							<button
								onClick={updateTask}
								className="bg-green-600 text-white p-2 rounded-lg"
							>
								Update
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Task List */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{tasks?.data?.data?.length > 0 ? (
					tasks?.data?.data?.map((task) => (
						<div
							key={task.id}
							className="flex justify-between items-center p-4 border rounded-lg shadow"
						>
							<div>
								<h3 className="font-medium">{task.title}</h3>
								<p className="text-sm text-gray-500">{task.description}</p>
								<p className="text-sm text-gray-600">
									Due: {formatDate(task.due_date)}
								</p>
							</div>
							<div className="flex gap-2">
								{task.status === 1 ? (
									<span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
										Pending
									</span>
								) : (
									<span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">
										Completed
									</span>
								)}
								<button
									onClick={() => openEditModal(task)}
									className="text-yellow-500"
								>
									<Edit size={20} />
								</button>
								<button
									onClick={() => deleteTask(task.id)}
									className="text-red-500"
								>
									<Trash size={20} />
								</button>
							</div>
						</div>
					))
				) : (
					<p className="text-red-700">No tasks found.</p>
				)}
			</div>
		</>
	);
};

export default TaskDashboard;
