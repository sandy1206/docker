const express = require('express');
const { createClient } = require('redis');
const app = express();

(async () => {
	const client = createClient({
		host:'redis-server',
	});

	client.on('error', (err) => console.error('Redis Client Error', err));

	await client.connect();

	// Initialize the visits key
	await client.set('visits', 0);

	app.get('/', async (req, res) => {
		try {
			const visits = await client.get('visits');
			res.send('number of visits: ' + visits);
			await client.set('visits', parseInt(visits) + 1);
		} catch (err) {
			console.error('Error getting or setting visits', err);
			res.status(500).send('Error');
		}
	});

	const port = 8081;
	app.listen(port, () => {
		console.log(`Server is running on http://localhost:${port}`);
	});
})();
