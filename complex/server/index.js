const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');

const keys = require('./keys');

const app = express();
app.use(cors())
app.use(bodyParser.json());


const port = 5000;

// PostgreSQL connection configuration
const pgClient = new Pool({
	user: keys.pgUser,
	host: keys.pgHost,
	database: keys.pgDatabase,
	password: keys.pgPassword,
	port: keys.pgPort,
	ssl:
		process.env.NODE_ENV !== 'production'
			? false
			: { rejectUnauthorized: false },
});

// Test the database connection

pgClient.on("connect", (client) => {
	client
		.query("CREATE TABLE IF NOT EXISTS values (number INT)")
		.catch((err) => console.error(err));
});

//  redis client setup
const redisClient = redis.createClient({
	host: keys.redisHost,
	port: keys.redisPort,
	retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate();

// Define your routes here
app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/values/all', async (req, res) => {
	const values = await pgClient.query('SELECT * FROM values');
	res.send(values.rows)
});

app.get('/values/current', async (req, res) => {
	redisClient.hgetall('values', (err, values) => {
		if (err) {
			console.log(err);
		} else {
			res.send(values);
		}
	});
});

app.post('/values', async (req, res) => {
	const index = req.body.index;
	if (parseInt(index) > 40) {
		return res.status(422).send('Index too high');
	}
	redisClient.hset('values', index, 'nothing yet!');
	redisPublisher.publish('insert', index);
	pgClient.query(' INSERT INTO values(number) VALUES($1)', [index]);
	res.send({ working: true });
});

// Start the server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
