const Sequelize = require('sequelize');
const { connection } = require('../database/connection');

const Category = connection.define('categories', {
	title: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	slug: {
		type: Sequelize.STRING,
		allowNull: false,
	},
});

Category.sync({force: false,}).then(() => {
	console.log('\nTable <Categories> create successful.\n')
});

module.exports = Category;
