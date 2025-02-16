import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const prepareHeaders = (headers) => {
	const token = localStorage.getItem('access_token');
	if (token) {
		headers.set('authorization', token);
	}
	return headers;
};

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/api/v1`,
		prepareHeaders,
	}),
	tagTypes: ['updateProfile', 'addTask', 'updatedTask', 'deleteTask'],
	endpoints: (builder) => ({
		createUser: builder.mutation({
			query: (data) => ({
				url: '/auth/signup',
				method: 'POST',
				body: data,
			}),
		}),

		signUpVerifiedOtp: builder.mutation({
			query: ({ data }) => ({
				url: `/auth/signup-verify-otp`,
				method: 'POST',
				body: data,
			}),
		}),

		login: builder.mutation({
			query: ({ data }) => ({
				url: `/auth/login`,
				method: 'POST',
				body: data,
			}),
		}),

		getUserProfile: builder.query({
			query: () => ({
				url: `/auth/profile`,
			}),
			providesTags: ['updateProfile'],
		}),

		updateUserProfile: builder.mutation({
			query: ({ data }) => ({
				url: `/auth/profile`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['updateProfile'],
		}),

		getTaskLists: builder.query({
			query: (searchInfo) => {
				let queryParams = '';

				if (searchInfo?.status) {
					queryParams += `${queryParams ? '&' : ''}status=${searchInfo.status}`;
				}

				if (searchInfo?.due_date) {
					queryParams += `${queryParams ? '&' : ''}due_date=${
						searchInfo.due_date
					}`;
				}

				if (searchInfo?.page) {
					queryParams += `${queryParams ? '&' : ''}page=${searchInfo.page}`;
				}

				if (searchInfo?.limit) {
					queryParams += `${queryParams ? '&' : ''}limit=${searchInfo.limit}`;
				}

				if (searchInfo?.sortBy) {
					queryParams += `${queryParams ? '&' : ''}sortBy=${searchInfo.sortBy}`;
				}

				if (searchInfo?.sortOrder) {
					queryParams += `${queryParams ? '&' : ''}sortOrder=${
						searchInfo.sortOrder
					}`;
				}


				return {
					url: `/tasks${queryParams ? `?${queryParams}` : ''}`,
				};
			},
			providesTags: ['addTask', 'updatedTask', 'deleteTask'],
		}),

		addTask: builder.mutation({
			query: ({ data }) => ({
				url: `/tasks`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['addTask'],
		}),

		updateTask: builder.mutation({
			query: ({ id, data }) => ({
				url: `/tasks/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['updatedTask'],
		}),

		deleteTask: builder.mutation({
			query: (id) => ({
				url: `/tasks/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['deleteTask'],
		}),
		forgotPassword: builder.mutation({
			query: ({data}) => ({
				url: `/auth/forgot-password`,
				method: 'POST',
				body: data,
			}),
		}),
		resetPassword: builder.mutation({
			query: ({token, data}) => ({
				url: `/auth/reset-password/${token}`,
				method: 'POST',
				body: data,
			}),
		}),
	}),
});

export const {
	useCreateUserMutation,
	useSignUpVerifiedOtpMutation,
	useLoginMutation,
	useGetUserProfileQuery,
	useUpdateUserProfileMutation,
	useGetTaskListsQuery,
	useAddTaskMutation,
	useUpdateTaskMutation,
	useDeleteTaskMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation
} = apiSlice;
