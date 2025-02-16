export const formatDate = (timeStampValue) => {
	const date = new Date(timeStampValue);
	const day = date.getDate();
	const month = date.toLocaleString('en-GB', { month: 'long' });
	const year = date.getFullYear();
	return `${day} ${month}, ${year}`;
};
