import React from 'react';
import { Link } from 'react-router-dom';

const OtherPage = () => {
	return (
		<div>
			<h1>Other Page</h1>
			<p>This is another page in your React app.</p>
			<Link to="/">Go back to Home</Link>
		</div>
	);
};

export default OtherPage;
