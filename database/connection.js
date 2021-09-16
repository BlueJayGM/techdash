const Sequelize = require('sequelize');

const connection = new Sequelize('techdash', 'root', 'shimoko123', {
	host: 'localhost',
	dialect: 'mysql',
	timezone: '-03:00',
});

function connect() {
	connection.authenticate()
	.then(() => console.log('Success to connect!'))
	.catch((err) => console.log('Error to connect!', err));
}

module.exports = { connection, connect };
